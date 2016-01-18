// Copyright 2015 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Directive for creating a list of skills (acquired and
 * pre-requisite skills) associated with a collection.
 * TODO (mgowano): Update the skills list as the pre-requisite and acquired list
 * get updated.
 *
 * @author mgowano@google.com (Abraham Mgowano)
 */

oppia.directive('collectionSkillsListDirective', [function() {
  return {
    restrict: 'E',
    scope: {
      getCollectionSkills: '&collectionSkills'
    },
    templateUrl: 'inline/collection_skills_list_directive'
  };
}]);
