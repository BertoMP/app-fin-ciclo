// Importación de las librerías necesarias
import swaggerJsdoc from 'swagger-jsdoc';

// Carga de las variables de entorno desde el archivo '.env'
import dotenv from 'dotenv';
dotenv.config();

// Definición de las opciones de configuración de Swagger
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MediAPP API',
			version: '1.0.0',
			description: 'API para la aplicación MediAPP',
		},
		servers: [
			{
				url: `${process.env.SERV_API_URL}`,
				description: 'Development server',
			},
		],
		components: {
			schemas: {
				AgendaItem: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID de la cita',
						},
						hora: {
							type: 'string',
							description: 'La hora de la cita',
						},
						informe_id: {
							type: 'integer',
							description: 'El ID del informe asociado a la cita',
						},
						paciente_id: {
							type: 'integer',
							description: 'El ID del paciente',
						},
						paciente_historia_clinica: {
							type: 'string',
							description: 'La historia clínica del paciente',
						},
						paciente_nombre: {
							type: 'string',
							description: 'El nombre del paciente',
						},
						paciente_primer_apellido: {
							type: 'string',
							description: 'El primer apellido del paciente',
						},
						paciente_segundo_apellido: {
							type: 'string',
							description: 'El segundo apellido del paciente',
						},
					},
				},
				CitaPaginada: {
					type: 'object',
					properties: {
						prev: {
							type: 'string',
							description: 'URL de la página anterior',
						},
						next: {
							type: 'string',
							description: 'URL de la próxima página',
						},
						pagina_actual: {
							type: 'integer',
							description: 'Número de la página actual',
						},
						paginas_totales: {
							type: 'integer',
							description: 'Número total de páginas',
						},
						cantidad_citas: {
							type: 'integer',
							description: 'Cantidad total de citas',
						},
						result_min: {
							type: 'integer',
							description: 'Índice del primer resultado en la página actual',
						},
						result_max: {
							type: 'integer',
							description: 'Índice del último resultado en la página actual',
						},
						items_pagina: {
							type: 'integer',
							description: 'Cantidad de items por página',
						},
						fecha_inicio: {
							type: 'string',
							description: 'Fecha de inicio del rango de búsqueda',
						},
						fecha_fin: {
							type: 'string',
							description: 'Fecha de fin del rango de búsqueda',
						},
						resultados: {
							type: 'object',
							properties: {
								datos_paciente: {
									type: 'object',
									properties: {
										paciente_id: {
											type: 'integer',
											description: 'El ID del paciente',
										},
										nombre: {
											type: 'string',
											description: 'El nombre del paciente',
										},
										primer_apellido: {
											type: 'string',
											description: 'El primer apellido del paciente',
										},
										segundo_apellido: {
											type: 'string',
											description: 'El segundo apellido del paciente',
										},
									},
								},
								citas: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'integer',
												description: 'El ID de la cita',
											},
											fecha: {
												type: 'string',
												description: 'La fecha de la cita',
											},
											hora: {
												type: 'string',
												description: 'La hora de la cita',
											},
											datos_especialista: {
												type: 'object',
												properties: {
													especialista_id: {
														type: 'integer',
														description: 'El ID del especialista',
													},
													nombre: {
														type: 'string',
														description: 'El nombre del especialista',
													},
													primer_apellido: {
														type: 'string',
														description: 'El primer apellido del especialista',
													},
													segundo_apellido: {
														type: 'string',
														description: 'El segundo apellido del especialista',
													},
													datos_especialidad: {
														type: 'object',
														properties: {
															especialidad_id: {
																type: 'integer',
																description: 'El ID de la especialidad',
															},
															especialidad_nombre: {
																type: 'string',
																description: 'El nombre de la especialidad',
															},
														},
													},
												},
											},
											datos_consulta: {
												type: 'object',
												properties: {
													consulta_id: {
														type: 'integer',
														description: 'El ID de la consulta',
													},
													consulta_nombre: {
														type: 'string',
														description: 'El nombre de la consulta',
													},
												},
											},
											informe_id: {
												type: 'integer',
												description: 'El ID del informe asociado a la cita',
											},
										},
									},
								},
							},
						},
					},
				},
				CitaItem: {
					type: 'object',
					properties: {
						datos_paciente: {
							type: 'object',
							properties: {
								paciente_id: {
									type: 'integer',
									description: 'El ID del paciente',
								},
								nombre: {
									type: 'string',
									description: 'El nombre del paciente',
								},
								primer_apellido: {
									type: 'string',
									description: 'El primer apellido del paciente',
								},
								segundo_apellido: {
									type: 'string',
									description: 'El segundo apellido del paciente',
								},
							},
						},
						datos_cita: {
							type: 'object',
							properties: {
								id: {
									type: 'integer',
									description: 'El ID de la cita',
								},
								fecha: {
									type: 'string',
									description: 'La fecha de la cita',
								},
								hora: {
									type: 'string',
									description: 'La hora de la cita',
								},
								datos_especialista: {
									type: 'object',
									properties: {
										especialista_id: {
											type: 'integer',
											description: 'El ID del especialista',
										},
										nombre: {
											type: 'string',
											description: 'El nombre del especialista',
										},
										primer_apellido: {
											type: 'string',
											description: 'El primer apellido del especialista',
										},
										segundo_apellido: {
											type: 'string',
											description: 'El segundo apellido del especialista',
										},
										datos_especialidad: {
											type: 'object',
											properties: {
												especialidad_id: {
													type: 'integer',
													description: 'El ID de la especialidad',
												},
												especialidad_nombre: {
													type: 'string',
													description: 'El nombre de la especialidad',
												},
											},
										},
									},
								},
								datos_consulta: {
									type: 'object',
									properties: {
										consulta_id: {
											type: 'integer',
											description: 'El ID de la consulta',
										},
										consulta_nombre: {
											type: 'string',
											description: 'El nombre de la consulta',
										},
									},
								},
								informe_id: {
									type: 'integer',
									description: 'El ID del informe asociado a la cita',
								},
							},
						},
					},
				},
				ConsultaPaginada: {
					type: 'object',
					properties: {
						prev: {
							type: 'string',
							description: 'URL de la página anterior',
						},
						next: {
							type: 'string',
							description: 'URL de la próxima página',
						},
						pagina_actual: {
							type: 'integer',
							description: 'Número de la página actual',
						},
						paginas_totales: {
							type: 'integer',
							description: 'Número total de páginas',
						},
						cantidad_consultas: {
							type: 'integer',
							description: 'Cantidad total de consultas',
						},
						result_min: {
							type: 'integer',
							description: 'Índice del primer resultado en la página actual',
						},
						result_max: {
							type: 'integer',
							description: 'Índice del último resultado en la página actual',
						},
						items_pagina: {
							type: 'integer',
							description: 'Cantidad de items por página',
						},
						resultados: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/ConsultaItem',
							},
						},
					},
				},
				CodigoPostalItem: {
					type: 'object',
					properties: {
						codigo_postal_id: {
							type: 'string',
							description: 'El código postal',
						},
					},
				},
				ConflictError: {
					type: 'object',
					properties: {
						errors: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
				ConsultaItem: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID de la consulta',
						},
						nombre: {
							type: 'string',
							description: 'El nombre de la consulta',
						},
						medicos_asociados: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id: {
										type: 'integer',
										description: 'El ID del médico',
									},
									nombre: {
										type: 'string',
										description: 'El nombre del médico',
									},
									primer_apellido: {
										type: 'string',
										description: 'El primer apellido del médico',
									},
									segundo_apellido: {
										type: 'string',
										description: 'El segundo apellido del médico',
									},
									datos_especialidad: {
										type: 'object',
										properties: {
											id: {
												type: 'integer',
												description: 'El ID de la especialidad',
											},
											nombre: {
												type: 'string',
												description: 'El nombre de la especialidad',
											},
										},
									},
								},
							},
						},
					},
				},
				Contacto: {
					type: 'object',
					required: ['nombre', 'descripcion', 'email', 'telefono', 'mensaje'],
					properties: {
						nombre: {
							type: 'string',
							description: 'El nombre del contacto',
						},
						descripcion: {
							type: 'string',
							description: 'La descripción del contacto',
						},
						email: {
							type: 'string',
							format: 'email',
							description: 'El email del contacto',
						},
						telefono: {
							type: 'string',
							description: 'El teléfono del contacto',
						},
						mensaje: {
							type: 'string',
							description: 'El mensaje del contacto',
						},
					},
				},
				EspecialidadItem: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID de la especialidad',
						},
						nombre: {
							type: 'string',
							description: 'El nombre de la especialidad',
						},
						descripcion: {
							type: 'string',
							description: 'La descripción de la especialidad',
						},
						imagen: {
							type: 'string',
							description: 'La URL de la imagen de la especialidad',
						},
					},
				},
				EspecialidadPaginada: {
					type: 'object',
					properties: {
						prev: {
							type: 'string',
							description: 'URL de la página anterior',
						},
						next: {
							type: 'string',
							description: 'URL de la próxima página',
						},
						pagina_actual: {
							type: 'integer',
							description: 'Número de la página actual',
						},
						paginas_totales: {
							type: 'integer',
							description: 'Número total de páginas',
						},
						cantidad_especialidades: {
							type: 'integer',
							description: 'Cantidad total de especialidades',
						},
						result_min: {
							type: 'integer',
							description: 'Índice del primer resultado en la página actual',
						},
						result_max: {
							type: 'integer',
							description: 'Índice del último resultado en la página actual',
						},
						items_pagina: {
							type: 'integer',
							description: 'Cantidad de items por página',
						},
						resultados: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/EspecialidadItem',
							},
						},
					},
				},
				EspecialistaItem: {
					type: 'object',
					properties: {
						usuario_id: {
							type: 'integer',
							description: 'El ID del usuario del especialista',
						},
						nombre: {
							type: 'string',
							description: 'El nombre del especialista',
						},
						primer_apellido: {
							type: 'string',
							description: 'El primer apellido del especialista',
						},
						segundo_apellido: {
							type: 'string',
							description: 'El segundo apellido del especialista',
						},
						email: {
							type: 'string',
							description: 'El email del especialista',
						},
						descripcion: {
							type: 'string',
							description: 'La descripción del especialista',
						},
						imagen: {
							type: 'string',
							description: 'La URL de la imagen del especialista',
						},
						turno: {
							type: 'string',
							description: 'El turno del especialista',
						},
						num_colegiado: {
							type: 'integer',
							description: 'El número de colegiado del especialista',
						},
						especialidad: {
							type: 'object',
							properties: {
								especialidad_id: {
									type: 'integer',
									description: 'El ID de la especialidad del especialista',
								},
								especialidad: {
									type: 'string',
									description: 'El nombre de la especialidad del especialista',
								},
							},
						},
						consulta: {
							type: 'object',
							properties: {
								consulta_id: {
									type: 'integer',
									description: 'El ID de la consulta del especialista',
								},
								consulta_nombre: {
									type: 'string',
									description: 'El nombre de la consulta del especialista',
								},
							},
						},
					},
				},
				GlucometriaPaginada: {
					type: 'object',
					properties: {
						prev: {
							type: 'string',
							description: 'URL de la página anterior',
						},
						next: {
							type: 'string',
							description: 'URL de la próxima página',
						},
						pagina_actual: {
							type: 'integer',
							description: 'Número de la página actual',
						},
						paginas_totales: {
							type: 'integer',
							description: 'Número total de páginas',
						},
						cantidad_glucometrias: {
							type: 'integer',
							description: 'Cantidad total de glucometrías',
						},
						result_min: {
							type: 'integer',
							description: 'Índice del primer resultado en la página actual',
						},
						result_max: {
							type: 'integer',
							description: 'Índice del último resultado en la página actual',
						},
						items_pagina: {
							type: 'integer',
							description: 'Cantidad de items por página',
						},
						fecha_inicio: {
							type: 'string',
							description: 'Fecha de inicio del rango de búsqueda',
						},
						fecha_fin: {
							type: 'string',
							description: 'Fecha de fin del rango de búsqueda',
						},
						resultados: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/GlucometriaItem',
							},
						},
					},
				},
				GlucometriaItem: {
					type: 'object',
					properties: {
						fecha: {
							type: 'string',
							description: 'La fecha de la medición de glucosa',
						},
						hora: {
							type: 'string',
							description: 'La hora de la medición de glucosa',
						},
						medicion: {
							type: 'integer',
							description: 'La medición de glucosa',
						},
					},
				},
				GlucometriaPost: {
					type: 'object',
					properties: {
						medicion: {
							type: 'integer',
							description: 'La medición de glucosa',
						},
					},
					required: ['medicion'],
				},
				Informe: {
					type: 'object',
					properties: {
						datos_cita: {
							type: 'object',
							properties: {
								id: {
									type: 'integer',
									description: 'El ID de la cita',
								},
								fecha: {
									type: 'string',
									description: 'La fecha de la cita',
								},
								hora: {
									type: 'string',
									description: 'La hora de la cita',
								},
							},
						},
						datos_paciente: {
							type: 'object',
							properties: {
								usuario_id: {
									type: 'integer',
									description: 'El ID del paciente',
								},
								num_historia_clinica: {
									type: 'string',
									description: 'La historia clínica del paciente',
								},
								nombre: {
									type: 'string',
									description: 'El nombre del paciente',
								},
								primer_apellido: {
									type: 'string',
									description: 'El primer apellido del paciente',
								},
								segundo_apellido: {
									type: 'string',
									description: 'El segundo apellido del paciente',
								},
							},
						},
						datos_especialista: {
							type: 'object',
							properties: {
								usuario_id: {
									type: 'integer',
									description: 'El ID del especialista',
								},
								num_colegiado: {
									type: 'integer',
									description: 'El número de colegiado del especialista',
								},
								especialidad: {
									type: 'string',
									description: 'La especialidad del especialista',
								},
								nombre: {
									type: 'string',
									description: 'El nombre del especialista',
								},
								primer_apellido: {
									type: 'string',
									description: 'El primer apellido del especialista',
								},
								segundo_apellido: {
									type: 'string',
									description: 'El segundo apellido del especialista',
								},
							},
						},
						datos_informe: {
							type: 'object',
							properties: {
								id: {
									type: 'integer',
									description: 'El ID del informe',
								},
								motivo: {
									type: 'string',
									description: 'El motivo del informe',
								},
								contenido: {
									type: 'string',
									description: 'El contenido del informe',
								},
								patologias: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'integer',
												description: 'El ID de la patología',
											},
											nombre: {
												type: 'string',
												description: 'El nombre de la patología',
											},
											descripcion: {
												type: 'string',
												description: 'La descripción de la patología',
											},
										},
									},
								},
							},
						},
					},
				},
				IncorrectPasswordOrEmailError: {
					type: 'object',
					properties: {
						errors: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
				InformePost: {
					type: 'object',
					properties: {
						motivo: {
							type: 'string',
							description: 'El motivo del informe',
						},
						patologias: {
							type: 'array',
							items: {
								type: 'integer',
								description: 'El ID de la patología',
							},
						},
						contenido: {
							type: 'string',
							description: 'El contenido del informe',
						},
						cita_id: {
							type: 'integer',
							description: 'El ID de la cita asociada al informe',
						},
					},
					required: ['motivo', 'patologias', 'contenido', 'cita_id'],
				},
				MedicamentoArray: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: {
								type: 'integer',
								description: 'El ID del medicamento',
							},
							nombre: {
								type: 'string',
								description: 'El nombre del medicamento',
							},
						},
					},
				},
				Medicamento: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID del medicamento',
						},
						nombre: {
							type: 'string',
							description: 'El nombre del medicamento',
						},
						descripcion: {
							type: 'string',
							description: 'La descripción del medicamento',
						},
					},
				},
				MedicamentoPaginado: {
					type: 'object',
					properties: {
						prev: {
							type: 'string',
							description: 'URL de la página anterior',
						},
						next: {
							type: 'string',
							description: 'URL de la próxima página',
						},
						pagina_actual: {
							type: 'integer',
							description: 'Número de la página actual',
						},
						paginas_totales: {
							type: 'integer',
							description: 'Número total de páginas',
						},
						cantidad_medicamentos: {
							type: 'integer',
							description: 'Cantidad total de medicamentos',
						},
						result_min: {
							type: 'integer',
							description: 'Índice del primer resultado en la página actual',
						},
						result_max: {
							type: 'integer',
							description: 'Índice del último resultado en la página actual',
						},
						items_pagina: {
							type: 'integer',
							description: 'Cantidad de items por página',
						},
						resultados: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/Medicamento',
							},
						},
					},
				},
				Municipio: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: {
								type: 'string',
								description: 'El id del municipio',
							},
							nombre: {
								type: 'string',
								description: 'El nombre del municipio',
							},
						},
					},
				},
				NotFoundError: {
					type: 'object',
					properties: {
						errors: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
				PacienteHistoria: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID del paciente',
						},
						nombre: {
							type: 'string',
							description: 'El nombre del paciente',
						},
						primer_apellido: {
							type: 'string',
							description: 'El primer apellido del paciente',
						},
						segundo_apellido: {
							type: 'string',
							description: 'El segundo apellido del paciente',
						},
						num_historia_clinica: {
							type: 'integer',
							description: 'El número de historia clínica del paciente',
						},
					},
				},
				PatologiaPaginada: {
					type: 'object',
					properties: {
						prev: {
							type: 'string',
							description: 'URL de la página anterior',
						},
						next: {
							type: 'string',
							description: 'URL de la próxima página',
						},
						pagina_actual: {
							type: 'integer',
							description: 'Número de la página actual',
						},
						paginas_totales: {
							type: 'integer',
							description: 'Número total de páginas',
						},
						cantidad_patologias: {
							type: 'integer',
							description: 'Cantidad total de patologías',
						},
						result_min: {
							type: 'integer',
							description: 'Índice del primer resultado en la página actual',
						},
						result_max: {
							type: 'integer',
							description: 'Índice del último resultado en la página actual',
						},
						items_pagina: {
							type: 'integer',
							description: 'Cantidad de items por página',
						},
						resultados: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/Patologia',
							},
						},
					},
				},
				Patologia: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID de la patología',
						},
						nombre: {
							type: 'string',
							description: 'El nombre de la patología',
						},
						descripcion: {
							type: 'string',
							description: 'La descripción de la patología',
						},
					},
				},
				Prescripcion: {
					type: 'object',
					properties: {
						datos_paciente: {
							type: 'object',
							properties: {
								id: { type: 'integer', description: 'ID del paciente' },
								nombre: { type: 'string', description: 'Nombre del paciente' },
								primer_apellido: {
									type: 'string',
									description: 'Primer apellido del paciente',
								},
								segundo_apellido: {
									type: 'string',
									description: 'Segundo apellido del paciente',
								},
								num_historia_clinica: {
									type: 'string',
									description: 'Número de historia clínica del paciente',
								},
							},
						},
						prescripciones: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									medicamento: {
										type: 'object',
										properties: {
											id: { type: 'integer', description: 'ID del medicamento' },
											nombre: {
												type: 'string',
												description: 'Nombre del medicamento',
											},
											descripcion: {
												type: 'string',
												description: 'Descripción del medicamento',
											},
											tomas: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														id: { type: 'integer', description: 'ID de la toma' },
														hora: {
															type: 'string',
															description: 'Hora de la toma',
														},
														dosis: {
															type: 'integer',
															description: 'Dosis de la toma',
														},
														fecha_inicio: {
															type: 'string',
															description: 'Fecha de inicio de la toma',
														},
														fecha_fin: {
															type: 'string',
															description: 'Fecha de fin de la toma',
														},
														observaciones: {
															type: 'string',
															description: 'Observaciones de la toma',
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
				Provincia: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: {
								type: 'string',
								description: 'El id de la provincia',
							},
							nombre: {
								type: 'string',
								description: 'El nombre de la provincia',
							},
						},
					},
				},
				ServerError: {
					type: 'object',
					properties: {
						errors: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
				SuccessMessage: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
							description: 'Mensaje de éxito',
						},
					},
				},
				TensionArterialPaginada: {
					type: 'object',
					properties: {
						prev: {
							type: 'string',
							description: 'URL de la página anterior',
						},
						next: {
							type: 'string',
							description: 'URL de la próxima página',
						},
						pagina_actual: {
							type: 'integer',
							description: 'Número de la página actual',
						},
						paginas_totales: {
							type: 'integer',
							description: 'Número total de páginas',
						},
						cantidad_tensionArterial: {
							type: 'integer',
							description: 'Cantidad total de mediciones de tensión arterial',
						},
						result_min: {
							type: 'integer',
							description: 'Índice del primer resultado en la página actual',
						},
						result_max: {
							type: 'integer',
							description: 'Índice del último resultado en la página actual',
						},
						items_pagina: {
							type: 'integer',
							description: 'Cantidad de items por página',
						},
						fecha_inicio: {
							type: 'string',
							description: 'Fecha de inicio del rango de búsqueda',
						},
						fecha_fin: {
							type: 'string',
							description: 'Fecha de fin del rango de búsqueda',
						},
						resultados: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									fecha: {
										type: 'string',
										description: 'La fecha de la medición de tensión arterial',
									},
									hora: {
										type: 'string',
										description: 'La hora de la medición de tensión arterial',
									},
									sistolica: {
										type: 'integer',
										description: 'La medición sistólica de la tensión arterial',
									},
									diastolica: {
										type: 'integer',
										description: 'La medición diastólica de la tensión arterial',
									},
									pulsaciones_minuto: {
										type: 'integer',
										description: 'Las pulsaciones por minuto en la medición de tensión arterial',
									},
								},
							},
						},
					},
				},
				TokenExpiredError: {
					type: 'object',
					properties: {
						errors: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
				TokenInvalidError: {
					type: 'object',
					properties: {
						errors: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
				TipoVia: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: {
								type: 'integer',
								description: 'El id del tipo de vía',
							},
							nombre: {
								type: 'string',
								description: 'El nombre del tipo de vía',
							},
						},
					},
				},
				Usuario: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID del usuario',
						},
						email: {
							type: 'string',
							description: 'El correo electrónico del usuario',
						},
						nombre: {
							type: 'string',
							description: 'El nombre del usuario',
						},
						primer_apellido: {
							type: 'string',
							description: 'El primer apellido del usuario',
						},
						segundo_apellido: {
							type: 'string',
							description: 'El segundo apellido del usuario',
						},
						dni: {
							type: 'string',
							description: 'El DNI del usuario',
						},
						rol_id: {
							type: 'integer',
							description: 'El ID del rol del usuario',
						},
						nombre_rol: {
							type: 'string',
							description: 'El nombre del rol del usuario',
						},
					},
				},
				UsuarioEspecialista: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID del usuario',
						},
						email: {
							type: 'string',
							description: 'El correo electrónico del usuario',
						},
						nombre: {
							type: 'string',
							description: 'El nombre del usuario',
						},
						primer_apellido: {
							type: 'string',
							description: 'El primer apellido del usuario',
						},
						segundo_apellido: {
							type: 'string',
							description: 'El segundo apellido del usuario',
						},
						dni: {
							type: 'string',
							description: 'El DNI del usuario',
						},
						num_colegiado: {
							type: 'string',
							description: 'El número de colegiado del especialista',
						},
						descripcion: {
							type: 'string',
							description: 'La descripción del especialista',
						},
						turno: {
							type: 'string',
							description: 'El turno del especialista',
						},
						especialidad_id: {
							type: 'integer',
							description: 'El ID de la especialidad del especialista',
						},
						consulta_id: {
							type: 'integer',
							description: 'El ID de la consulta del especialista',
						},
						imagen: {
							type: 'string',
							description: 'La imagen del especialista',
						},
					},
				},
				UsuarioPaciente: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							description: 'El ID del usuario',
						},
						email: {
							type: 'string',
							description: 'El correo electrónico del usuario',
						},
						nombre: {
							type: 'string',
							description: 'El nombre del usuario',
						},
						primer_apellido: {
							type: 'string',
							description: 'El primer apellido del usuario',
						},
						segundo_apellido: {
							type: 'string',
							description: 'El segundo apellido del usuario',
						},
						dni: {
							type: 'string',
							description: 'El DNI del usuario',
						},
						num_historia_clinica: {
							type: 'string',
							description: 'La historia clínica del paciente',
						},
						fecha_nacimiento: {
							type: 'string',
							description: 'La fecha de nacimiento del paciente',
						},
						tipo_via: {
							type: 'string',
							description: 'El tipo de vía del domicilio del paciente',
						},
						nombre_via: {
							type: 'string',
							description: 'El nombre de la vía del domicilio del paciente',
						},
						numero: {
							type: 'integer',
							description: 'El número de la vía del domicilio del paciente',
						},
						piso: {
							type: 'string',
							description: 'El piso del domicilio del paciente',
						},
						puerta: {
							type: 'string',
							description: 'La puerta del domicilio del paciente',
						},
						provincia_id: {
							type: 'string',
							description: 'El ID de la provincia del domicilio del paciente',
						},
						municipio: {
							type: 'string',
							description: 'El municipio del domicilio del paciente',
						},
						codigo_postal: {
							type: 'string',
							description: 'El código postal del domicilio del paciente',
						},
						tel_fijo: {
							type: 'string',
							description: 'El teléfono fijo del paciente',
						},
						tel_movil: {
							type: 'string',
							description: 'El teléfono móvil del paciente',
						},
					},
				},
				UsuarioPaginado: {
					type: 'object',
					properties: {
						prev: {
							type: 'string',
							description: 'URL de la página anterior',
						},
						next: {
							type: 'string',
							description: 'URL de la próxima página',
						},
						pagina_actual: {
							type: 'integer',
							description: 'Número de la página actual',
						},
						paginas_totales: {
							type: 'integer',
							description: 'Número total de páginas',
						},
						cantidad_usuarios: {
							type: 'integer',
							description: 'Cantidad total de usuarios',
						},
						result_min: {
							type: 'integer',
							description: 'Índice del primer resultado en la página actual',
						},
						result_max: {
							type: 'integer',
							description: 'Índice del último resultado en la página actual',
						},
						items_pagina: {
							type: 'integer',
							description: 'Cantidad de items por página',
						},
						resultados: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/Usuario',
							},
						},
					},
				},
				ValidationError: {
					type: 'object',
					properties: {
						errors: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
			},
		},
	},
	apis: ['./routes/api/*.js'],
};

// Inicialización de swagger-jsdoc: Devuelve un objeto swaggerSpec que contiene la especificación Swagger
const specs = swaggerJsdoc(options);

// Exportación de la especificación Swagger
export default specs;
