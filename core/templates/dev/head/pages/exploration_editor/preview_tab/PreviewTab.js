// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Controllers and services for the exploration preview in the
 * editor page.
 */

oppia.controller('PreviewTab', [
  '$scope', '$uibModal', '$q', '$timeout', 'LearnerParamsService',
  'ExplorationDataService', 'ExplorationAdvancedFeaturesService',
  'explorationCategoryService', 'EditorStateService',
  'explorationInitStateNameService', 'explorationParamChangesService',
  'explorationParamSpecsService', 'explorationStatesService',
  'explorationTitleService', 'ExplorationPlayerService',
  'ParameterMetadataService', 'ParamChangeObjectFactory',
  'UrlInterpolationService',
  function(
      $scope, $uibModal, $q, $timeout, LearnerParamsService,
      ExplorationDataService, ExplorationAdvancedFeaturesService,
      explorationCategoryService, EditorStateService,
      explorationInitStateNameService, explorationParamChangesService,
      explorationParamSpecsService, explorationStatesService,
      explorationTitleService, ExplorationPlayerService,
      ParameterMetadataService, ParamChangeObjectFactory,
      UrlInterpolationService) {
    $scope.isExplorationPopulated = false;
    ExplorationDataService.getData().then(function() {
      var initStateNameForPreview = EditorStateService.getActiveStateName();
      var manualParamChanges = [];

      // Show a warning message if preview doesn't start from the first state
      if (initStateNameForPreview !==
          explorationInitStateNameService.savedMemento) {
        $scope.previewWarning =
          'Preview started from \"' + initStateNameForPreview + '\"';
      } else {
        $scope.previewWarning = '';
      }

      // Prompt user to enter any unset parameters, then populate exploration
      manualParamChanges = $scope.getManualParamChanges(initStateNameForPreview)
        .then(function(manualParamChanges) {
          $scope.loadPreviewState(initStateNameForPreview, manualParamChanges);
        }
      );
    });

    $scope.getManualParamChanges = function(initStateNameForPreview) {
      var deferred = $q.defer();

      var unsetParametersInfo = ParameterMetadataService.getUnsetParametersInfo(
        [initStateNameForPreview]);

      // Construct array to hold required parameter changes
      var manualParamChanges = [];
      for (var i = 0; i < unsetParametersInfo.length; i++) {
        var newParamChange = ParamChangeObjectFactory.createEmpty(
          unsetParametersInfo[i].paramName);
        manualParamChanges.push(newParamChange);
      }

      // Use modal to populate parameter change values
      if (manualParamChanges.length > 0) {
        $scope.showSetParamsModal(manualParamChanges, function() {
          deferred.resolve(manualParamChanges);
        });
      } else {
        deferred.resolve([]);
      }

      return deferred.promise;
    };

    $scope.showParameterSummary = function() {
      return (ExplorationAdvancedFeaturesService.areParametersEnabled() &&
              !angular.equals({}, $scope.allParams));
    };

    $scope.showSetParamsModal = function(manualParamChanges, callback) {
      var modalInstance = $uibModal.open({
        templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
          '/pages/exploration_editor/preview_tab/' +
          'preview_set_parameters_modal_directive.html'),
        backdrop: 'static',
        windowClass: 'oppia-preview-set-params-modal',
        controller: [
          '$scope', '$uibModalInstance', 'RouterService',
          function($scope, $uibModalInstance, RouterService) {
            $scope.manualParamChanges = manualParamChanges;
            $scope.previewParamModalOk = $uibModalInstance.close;
            $scope.previewParamModalCancel = function() {
              $uibModalInstance.dismiss('cancel');
              RouterService.navigateToMainTab();
            };
          }
        ]
      }).result.then(function() {
        if (callback) {
          callback();
        }
      });
    };

    $scope.loadPreviewState = function(stateName, manualParamChanges) {
      ExplorationPlayerService.initSettingsFromEditor(
        stateName, manualParamChanges);
      $scope.isExplorationPopulated = true;
    };

    $scope.resetPreview = function() {
      $scope.previewWarning = '';
      $scope.isExplorationPopulated = false;
      initStateNameForPreview = explorationInitStateNameService.savedMemento;
      $timeout(function() {
        ExplorationPlayerService.init(function(exploration, initHtml,
            newParams) {
          $scope.loadPreviewState(initStateNameForPreview, []);
        });
      }, 200);
    };

    // This allows the active state to be kept up-to-date whilst navigating in
    // preview mode, ensuring that the state does not change when toggling
    // between editor and preview.
    $scope.$on('updateActiveStateIfInEditor', function(evt, stateName) {
      EditorStateService.setActiveStateName(stateName);
    });

    $scope.allParams = {};
    $scope.$on('playerStateChange', function() {
      $scope.allParams = LearnerParamsService.getAllParams();
    });
  }
]);
