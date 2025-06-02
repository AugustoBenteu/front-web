import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
    colors: {
        brand: {
            primary: '#6D28D9',      // Roxo principal (ex: violet-600)
            primaryDarker: '#5B21B6',
        },
        textColors: {
            default: 'gray.800',
            muted: 'gray.600',
            navLink: 'gray.700',
        },
        ui: {
            inputBorder: 'gray.300',
            inputFocusBorder: 'brand.primary',
            navButtonBorder: 'gray.300',
            navButtonBg: '#F5F5F5',
        },
    },
    components: {
        Button: {
            variants: {
                // Botão de ação principal (roxo)
                solidBrand: (props: any) => ({
                    bg: 'brand.primary',
                    color: 'white',
                    _hover: {
                        bg: 'brand.primaryDarker',
                        _disabled: {
                            bg: 'brand.primary',
                        }
                    },
                    _active: {
                        bg: 'brand.primaryDarker',
                    },
                }),
                // Botão "Criar conta" na navbar
                outlineNeutral: (props: any) => ({
                    bg: 'ui.navButtonBg',
                    borderColor: 'ui.navButtonBorder',
                    color: 'textColors.default',
                    _hover: {
                        bg: 'gray.200',
                        borderColor: 'gray.400',
                    },
                    _active: {
                        bg: 'gray.300',
                    }
                }),
            },
        },
        Input: {
            defaultProps: {
                focusBorderColor: 'brand.primary', // todos os inputs
            },
            variants: {
                outline: {
                    field: {
                        borderColor: 'ui.inputBorder',
                        _hover: {
                            borderColor: 'gray.400',
                        },
                    },
                },
            },
        },
        Link: {
            variants: {
                nav: {
                    color: 'textColors.navLink',
                    fontWeight: 'medium',
                    _hover: {
                        textDecoration: 'none',
                        color: 'brand.primary',
                    },
                },
                formLink: { //link "Criar conta" dentro do formulário
                    color: 'blue.500',
                    fontWeight: 'medium',
                    _hover: {
                        textDecoration: 'underline',
                    },
                },
            },
        },
        Text: {
            baseStyle: {
                color: 'textColors.default',
            },
            variants: {
                muted: {
                    color: 'textColors.muted',
                    fontSize: 'sm',
                },
            },
        },
        Heading: {
            baseStyle: {
                color: 'textColors.default',
            },
        },
        FormLabel: {
            baseStyle: {
                color: 'textColors.default',
                fontWeight: 'medium',
            },
        },
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'textColors.default',
            },
        },
    },
});

export default customTheme;