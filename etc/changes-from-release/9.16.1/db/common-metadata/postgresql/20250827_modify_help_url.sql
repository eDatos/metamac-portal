-- --------------------------------------------------------------------------------------------------
-- EDATOS-5215 - Enlazar píldora multiidioma en portal
-- --------------------------------------------------------------------------------------------------

-- Modifica lo que ahora es una string con una url por un texto multiidioma en el que el idioma es el idioma por defecto (sustituir FILL_ME_WITH_DEFAULT_LOCALE por el primer idioma de la
-- propiedad metamac.edition.languages) y el valor es el valor que tenía antes la propiedad.
UPDATE tb_data_configurations SET conf_value = '{ "text": [{ "lang": "FILL_ME_WITH_DEFAULT_LOCALE", "value": "' || conf_value || '"}]}' WHERE conf_key = 'metamac.portal.visualizer.help.url';
commit;
