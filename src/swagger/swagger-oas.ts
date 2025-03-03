import { Logger } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import * as fs from 'fs';

export const writeJsonToFile = (document: OpenAPIObject) => {
  const filePath = 'oas.json'; // Path to the file in the project root
  try {
    const jsonString = JSON.stringify(document, null, 2); // Pretty-print JSON
    fs.writeFileSync(filePath, jsonString);
    Logger.log(
      JSON.stringify({
        context: `Swagger's OAS file re-generated: ${filePath}`,
        resource: `Swagger`,
      }),
    );
  } catch (error) {
    Logger.error(
      JSON.stringify({
        context: `Unable to re-generate Swagger's OAS file.: ${error}`,
        message: error?.message,
        resource: `Swagger`,
      }),
    );
  }
};

export const swaggerDocumentModifications = (
  document: OpenAPIObject,
): OpenAPIObject => {
  return {
    ...document,
    components: {
      ...document.components,
      schemas: filterAndSortSchemas(document.components?.schemas),
    },
  };
};

// INFO: Organizing the schema using conditional filtering to achieve an alphabetically sorted order.
// INFO: Schemas were not sorted in alphabetical order.
const filterAndSortSchemas = (
  schemas?: Record<string, ReferenceObject | SchemaObject>,
) => {
  return Object?.fromEntries(
    Object?.entries(schemas ?? {}).sort((a, b) => a[0].localeCompare(b[0])),
  );
};
