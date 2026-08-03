I18n.translations || (I18n.translations = {});

I18n.translations.pt = {

    number: {
        format: {
            separator: ",", /* Decimal */
            delimiter: " ", /* Thousands */
            strip_insignificant_zeros: false
        }
    },
    filter: {
        button: {
            selection: "Seleção",
            info: "Informação",
            table: "Tabela",
            column: "Colunas",
            bar: "Bares",
            line: "Linhas",
            charts: "Gráficos",
            maps: "Mapas",
            map: "Mapa coroplético",
            mapbubble: "Mapa de símbolos",
            fullscreen: "Maximizar",
            minimizedScreen: "Minimizar",
            helpUrl: "Ajuda",
            share: "Partilhar",
            download: "Baixar",
            apiEndpoints: "Consultas à API",
            save: "Salvar",
            accept: "Aceitar",
            cancel: "Cancelar",
            selectAll: "Selecionar",
            deselectAll: "Desselecionar",
            reverseOrder: "Ordem inversa",
            close: "Fechar",
            visualize: "Visualizar",
            embed: "Widget",
            disabledFeature: {
                internalPortal: "Este recurso está desativado no visualizador interno"
            }
        },
        download: {
            selection: "Download da seleção",
            all: "Download de tudo",
            modal: {
                title: "Baixar informações"
            },
            excel: {
                disabled: "Este recurso não pode ser baixado como XLSX porque excede o número de observações para este formato."
            },
            attributes: {
                modal: {
                    title: "BAIXAR - Opções",
                    question: "Incluir os atributos no download"
                }
            },
            options: {
                title: "Propriedades de exportação",
                download: "Download"
            },
            decimalSeparator: {
                title: "Separador decimal",
                comma: "Vírgula",
                dot: "Ponto"
            },
            menu: {
                xlsx: "Formato XLSX",
                tsv: "Formato TSV",
                px: "Formato PX",
                jsonstat: "Formato JSONSTAT",
                svg: "Formato SVG",
                png: "Formato PNG",
                pdf: "Formato PDF"
            }
        },
        share: {
            permanent: "Ligação permanente:"
        },
        embed: {
            instructions: "Seleciona, copia e cola este código na tua página: "
        },
        save: {
            button: {
                submit: "Salvar",
            },
            label: {
                name: "Nome da consulta personalizada",
                notes: "Notas"
            },
            modal: {
                title: "Salvar consulta personalizada",
                success: "A consulta personalizada foi salva com sucesso",
                failure: "Ocorreu um problema ao salvar a consulta personalizada"
            }
        },
        text: {
            fixedDimensions: "Valores fixos",
            leftDimensions: "Linhas",
            topDimensions: "Colunas",
            fixedDimensionX: "Dimensão Fixa",
            horizontalAxis: "Eixo horizontal",
            columns: "Colunas",
            bars: "Bares",
            lines: "Linhas",
            sectors: "Sectores",
            map: "Territorios",
            mapbubble: "Territorios",
            "for": "Para"
        },
        sidebar: {
            ignorable: {
                null: 'Ver categorias com células em branco',
                zero: 'Ver categorias com zero células'
            },
            info: {
                title: "Info"
            },
            filter: {
                title: "Filtro",
                search: "Pesquisa"
            },
            order: {
                title: "Ordem",
                info: {
                    fixed: "",
                    left: "",
                    top: ""
                },
                table: {
                    fixed: "Valores fixos",
                    left: "Linhas",
                    top: "Colunas"
                },
                column: {
                    fixed: "Valores fixos",
                    left: "Eixo X",
                    axisy: "Eixo Y",
                    top: "Colunas"
                },
                bar: {
                    fixed: "Valores fixos",
                    left: "Eixo Y",
                    axisy: "Eixo X",
                    top: "Bares"
                },
                line: {
                    fixed: "Valores fixos",
                    left: "Eixo X",
                    axisy: "Eixo Y",
                    top: "Linhas"
                },
                map: {
                    fixed: "Valores fixos",
                    left: "Territórios"
                },
                mapbubble: {
                    fixed: "Valores fixos",
                    left: "Territórios"
                }

            }
        },
        selector: {
            level: {
                template: "Nível {{level}}",
                all: "Todos"
            },
            temporal: {
                YEARLY: "Anual",
                BIYEARLY: "Semestral",
                FOUR_MONTHLY: "Trimestral",
                QUARTERLY: "Trimestral",
                MONTHLY: "Por mês",
                WEEKLY: "Semanalmente",
                DAILY: "Diários",
                HOURLY: "Por horas",
            }
        },
        sort: {
            options: {
                OBSERVATION: "Por valor",
                REPRESENTATION: "Por categoria"
            }
        }
    },
    ve: {
        map: {
            nomap: "Mapa indisponível"
        },
        mapbubble: {
            nomap: "Mapa indisponível"
        },
        noSelection: "Você deve escolher pelo menos uma categoria em cada dimensão.",
        selectAtLeastTwoItems: "Você deve selecionar pelo menos dois valores da mesma granularidade geográfica",
        noShapesAvailable: "Não há mapa disponível para os valores selecionados",
        loading: "Carregando dados..."
    },

    entity: {
        dataset: {
            title: "Título",
            description: "Descrição",
            subtitle: "Legenda",
            abstract: "Abstrato",
            measureDimensionCoverageConcepts: "Measure dimension coverage concepts",
            statisticalOperation: "Ooperação estatística",
            validFrom: "Válido desde",
            validTo: "Válido até",
            dateStart: "Período inicial",
            dateEnd: "Período final",
            version: "Versão",
            versionRationale: {
                title: "Fundamento para a mudança",
                enum: {
                    MAJOR_CATEGORIES: "Grande: Categorias",
                    MAJOR_ESTIMATORS: "Grande: Estimadores",
                    MAJOR_NEW_RESOURCE: "Grande: Novo recurso",
                    MAJOR_OTHER: "Grande: Outras",
                    MAJOR_VARIABLES: "Grande: Variáveis",
                    MINOR_DATA_UPDATE: "Pequena: Atualização de dados",
                    MINOR_ERRATA: "Pequena: Errata",
                    MINOR_METADATA: "Pequena: Metadados",
                    MINOR_OTHER: "Pequena: De outros",
                    MINOR_SERIES_UPDATE: "Pequena: Atualização da série"
                }
            },
            replacesVersion: "Substituir versão",
            isReplacedByVersion: "É sustituído pela versão",
            publishers: "Publicadores",
            contributors: "Contribuidores de publicación",
            mediators: "Mediadores",
            replaces: "Substitui",
            isReplacedBy: "Substituído por",
            relatedResources: {
                title: "Recursos relacionados",
                multidataset: "Relacionado ao multidataset"
            },
            rightsHolder: "Titular dos direitos",
            copyrightDate: "Data de copyright",
            license: "Licença",
            nolicense: "Licença indisponível",
            accessRights: "Direitos de acesso",
            subjectAreas: "Áreas",
            formatExtentObservations: "Tamanho da tabela",
            lastUpdate: "Data da última atualização",
            dateNextUpdate: "Data da próxima atualização",
            header: {
                lastUpdate: "Última atualização: {{dateLastUpdate}}",
                nextUpdate: "Próxima atualização: {{dateNextUpdate}}",
            },
            updateFrequency: "Frequência de atualização",
            statisticOfficiality: "Estatísticas Oficiais",
            bibliographicCitation: "Citação bibliográfica",
            dataProviders: "Provedores de dados",
            dataProviderAnnotations: "Observações associadas a provedores de dados",
            measureConcepts: {
                title: "O que é medido pelos dados",
                annotations: "Notas gerais"
            },

            section: {
                descriptors: "Descritores de tabela",
                validity: "Validade dos dados",
                periods: "Períodos de referência",
                dimensions: "Quais são as variáveis ​​de dados",
                datasetAttributes: "Notas do conjunto de dados",
                version: "Número da versão e atualizações de dados",
                reuse: "Reutilização e informações para desenvolvedores"
            },

            seeConcept: {
                button: "Ver conceito",
            },
            seeRelatedResource: {
                button: "Ver classificação"
            },

            language: "Idioma",

            apiDocumentationUrl: "Acesso à documentação API",
            apiUrl: {
                title: "Acesso à API para desenvolvedores",
                apiEndpoints: "O recurso pode ser obtido nos seguintes formatos: {{formats}}. Para construir a chamada da API basta adicionar o formato ao final da URL, por exemplo, para construir a chamada no formato {{formatExample}} seria feito da seguinte forma: URL.{{formatExampleLowercase}}"
            },
            selectionApiUrl: {
                title: "Acessar a seleção atual na API",
                apiEndpoints: "A seleção também pode ser obtida em diversos formatos ({{formats}}). Neste caso, para construir a chamada API deve-se levar em consideração que o formato deve ser indicado antes de passar os parâmetros, por exemplo: URL.{{formatExampleLowercase}}?PARAMETERS"
            },
            nextVersion: {
                title: "Próxima atualização",
                enum: {
                    NON_SCHEDULED_UPDATE: "Atualização não agendada",
                    NO_UPDATES: "Sem atualizações",
                    SCHEDULED_UPDATE: "Atualização agendada"
                }
            }
        },
        kind: {
            types: {
                collection: "Publicações",
                dataset: "Datasets",
                query: "Consultas",
                multidataset: "Multidatasets"
            }
        },
        observation: {
            measure: {
                title: 'Dados de observação',
                data: 'Dados'
            },
            attributes: {
                title: 'Atributos de observação',
                primaryMeasure: 'Atributos no nível de observação',
                combinatedDimensions: 'Atributos no nível de dimensões',
            }
        },
        category: {
            measure: {
                unit: 'Unidade de medida',
                multiplier: 'Multiplicador de unidade',
                unitMeasure: '{{multiplier}} de {{unit}}',
                unitMeasureStartsWithVowel: '{{multiplier}} de {{unit}}',
            },
            attributes: {
                title: 'Atributos da categoria'
            }
        },
        granularity: {
            temporal: {
                enum: {
                    YEARLY: "Yearly",
                    BIYEARLY: "Semestral",
                    QUARTERLY: "Trimestral",
                    FOUR_MONTHLY: "Cuatrimestral",
                    MONTHLY: "Por mês",
                    WEEKLY: "Semanal",
                    DAILY: "Diariamente",
                    HOURLY: "Cada hora"
                }
            }
        }
    },
    date: {
        formats: {
            "default": "%d-%m-%Y",
            "short": "%d de %B",
            "long": "%d de %B de %Y"
        },
        day_names: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        abbr_day_names: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        month_names: ["null", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        abbr_month_names: ["null", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        meridian: ["am", "pm"]
    },
    indicator: {
        dimension: {
            name: {
                TIME: "Períodos",
                MEASURE: "Medidas",
                GEOGRAPHICAL: "Localização geografica"
            }
        }
    },
    login: {
        button: {
            submit: "Iniciar sessão",
            register: "Inscrever-se"
        },
        label: {
            email: "Correio eletrônico",
            password: "Senha"
        },
        modal: {
            title: "Usuário",
            success: "Você fez login com sucesso",
            failure: "Ocorreu um problema ao fazer login"
        },
        error: {
            client: "Correio eletrônico ou senha inválida.",
            server: "Ocorreu um problema ao fazer login. Tente novamente mais tarde."
        }
    },
    modal: {
        confirmation: {
            button: {
                confirm: "Sim",
                reject: "Não"
            }
        },
        information: {
            loginRequired: {
                title: "Ação inválida",
                message: "A ação que você deseja realizar requer que você faça login primeiro. Você quer fazer o login?"
            }
        },
        permalinkConfig: {
            button: {
                submit: "Salvar",
            },
            label: {
                version: {
                    group: "Dados",
                    last: "Atualizar os dados com possíveis correções ou modificações dos mesmos",
                    current: "Sempre mostrar dados atuais",
                },
                data: {
                    grupo: "Dados",
                    update: "Atualizar os dados com novos períodos",
                    selected: "Corrigir os dados para o período selecionado",
                },
                dataReview: {
                    group: "Revisões de dados",
                    update: "Atualização com revisões de dados"
                },
                periods: {
                    group: "Períodos",
                    quantity: "Atualizar com os últimos n períodos:",
                    date: "Atualização do seguinte período:",
                    all: "Atualizar com todos os períodos",
                }
            },
            error: {
                quantity: "O campo numérico na seção 'Atualizar com os últimos n períodos' deve ser um número inteiro positivo maior ou igual a um.",
                periods: "Você deve selecionar uma das opções na seção 'Períodos'."
            },
            info: {
                noTemporalDimension: "Este recurso não permite a escolha do período porque não possui uma dimensão temporal.",
                noVersionUpdate: "Este recurso não permite verificar versões anteriores."
            }
        },
        embedConfig: {
            button: {
                submit: "Ver código",
            },
            label: {
                title: "Título"
            }
        },
        shareConfig: {
            button: {
                submit: "Ver link",
            },
        },
        saveConfig: {
            button: {
                submit: "Ver descritores",
            },
        }
    },
    captcha: {
        button: {
            text: "Mandar"
        },
        label: {
            text: "Escreva o valor da imagem mostrada acima"
        }
    },
    operations: {
        empty: "Não há operações disponíveis.",
        error: "Não foi possível carregar a lista de operações."
    }
};
