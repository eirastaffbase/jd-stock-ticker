/*!
 * Copyright 2024, Staffbase GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UiSchema } from "@rjsf/utils"; // Or your specific import for UiSchema
import { JSONSchema7 } from "json-schema";

/**
 * schema used for generation of the configuration dialog
 * see https://rjsf-team.github.io/react-jsonschema-form/docs/ for documentation
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    logo: {
      type: "string",
      title: "Custom logo URL",
      default:
        "https://jdonline.staffbase.com/api/media/secure/external/v2/image/upload/680a642ac83d6e736cfc366c.png",
    },
    fontsizeadjustment: {
      type: "integer", // Using integer for whole percentages
      title: "Font Size Adjustment (%)",
      description: "Adjust overall font size. 0 for default, 10 for 10% larger, -10 for 10% smaller.",
      default: 0, // This default will now work with the range
      // You can also specify min/max here, and RJSF might pick it up for the range
      minimum: -50, // Example minimum
      maximum: 100,  // Example maximum
    },
  },
};

export const uiSchema: UiSchema = {
  logo: {
    "ui:help":
      "Optional. Paste a direct image URL to replace the default Deere logo.",
  },
  fontsizeadjustment: {
    "ui:widget": "range",
    "ui:help":
      "Adjust font size from -50% to +100%. Default is 0%.",
    "ui:options": {
      "min": -50, // Explicitly set the minimum value for the slider
      "max": 100, // Explicitly set the maximum value for the slider
      "step": 5,  // Define the granularity of the slider
      // RJSF might also show the current value next to the slider.
      // Some themes might require additional configuration for this.
    },
  },
};