import sanitizeHtml from 'sanitize-html';

/**
 * @name sanitizeInput
 * @description Sanitiza el contenido HTML de una cadena de texto.
 * @memberof Util-Functions
 * @function
 * @param {string} input - Cadena de texto con contenido HTML.
 * @returns {string} - Cadena de texto con contenido HTML sanitizado.
 */
export const sanitizeInput = (input) => {
	return sanitizeHtml(input, {
		allowedTags: [
			'p',
			'br',
			'a',
			'b',
			'strong',
			'i',
			'em',
			'u',
			's',
			'ol',
			'ul',
			'li',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'blockquote',
			'code',
			'pre',
			'sub',
			'sup',
			'small',
		],
		allowedAttributes: {
			a: [ 'href' ]
		}
	});
}
