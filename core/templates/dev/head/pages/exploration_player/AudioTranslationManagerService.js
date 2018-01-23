// Copyright 2018 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service to manage what audio translations are currently
 * being played or paused.
 */

oppia.factory('AudioTranslationManagerService', function() {
  // Audio translations for the main content of a card at the top.
  var _contentAudioTranslations = null;
  var _contentHtmlForAutogeneratedAudio = null;

  // Audio translations for everything other than the main content, such as
  // those for feedback, hints, and solutions.
  var _secondaryAudioTranslations = null;
  var _secondaryHtmlForAutogeneratedAudio = null;

  var _currentPrimaryComponentName = null;
  var _currentSecondaryComponentName = null;

  return {
    setContentAudioTranslations: function(
        audioTranslations, html, componentName) {
      _contentAudioTranslations = audioTranslations;
      _contentHtmlForAutogeneratedAudio = html;
      _currentPrimaryComponentName = componentName;
    },
    setSecondaryAudioTranslations: function(
        audioTranslations, html, componentName) {
      _secondaryAudioTranslations = audioTranslations;
      _secondaryHtmlForAutogeneratedAudio = html;
      _currentSecondaryComponentName = componentName;
    },
    clearSecondaryAudioTranslations: function() {
      _secondaryAudioTranslations = null;
      _secondaryHtmlForAutogeneratedAudio = null;
      _currentSecondaryComponentName = null;
    },
    getCurrentAudioTranslations: function() {
      if (_secondaryAudioTranslations != null) {
        return _secondaryAudioTranslations;
      }
      return _contentAudioTranslations;
    },
    getCurrentHtmlForAutogeneratedAudio: function() {
      if (_secondaryHtmlForAutogeneratedAudio != null) {
        return _secondaryHtmlForAutogeneratedAudio;
      }
      return _contentHtmlForAutogeneratedAudio;
    },
    getCurrentComponentName: function() {
      if (_currentSecondaryComponentName != null) {
        return _currentSecondaryComponentName;
      }
      return _currentPrimaryComponentName;
    }
  };
});
