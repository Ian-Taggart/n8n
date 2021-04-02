import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';
import { IDataObject } from 'n8n-workflow';
import { OptionsWithUri } from 'request';

export async function cockpitApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('cockpitApi');

	if (credentials === undefined) {
		throw new Error('No credentials available.');
	}

	let options: OptionsWithUri = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		qs: {
			token: credentials!.accessToken,
		},
		body,
		uri: uri || `${credentials!.url}/api${resource}`,
		json: true,
	};

	options = Object.assign({}, options, option);

	if (Object.keys(options.body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.request!(options);
	} catch (error) {
		let errorMessage = error.message;
		if (error.error) {
			errorMessage = error.error.message || error.error.error;
		}

		throw new Error(`Cockpit error [${error.statusCode}]: ` + errorMessage);
	}
}

export function createDataFromParameters(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, itemIndex: number): IDataObject {
	const dataFieldsAreJson = this.getNodeParameter('jsonDataFields', itemIndex) as boolean;

	if (dataFieldsAreJson) {
		// Parameters are defined as JSON
		return JSON.parse(this.getNodeParameter('dataFieldsJson', itemIndex, '{}') as string);
	}

	// Parameters are defined in UI
	const uiDataFields = this.getNodeParameter('dataFieldsUi', itemIndex, {}) as IDataObject;
	const unpacked: IDataObject = {};

	if (uiDataFields.field === undefined) {
		return unpacked;
	}

	for (const field of uiDataFields!.field as IDataObject[]) {
		unpacked[field!.name as string] = field!.value;
	}

	return unpacked;
}
