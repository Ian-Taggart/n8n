import { INodeProperties } from 'n8n-workflow';

export const templateOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'template',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'create a template',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const templateFields = [

	/* -------------------------------------------------------------------------- */
	/*                                template:create                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Template',
		name: 'template',
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'template',
				],
				operation: [
					'create',
				],
			},
		},
		required: true,
		default: '',
		description: 'The Home Assistant template.',
	},
] as INodeProperties[];