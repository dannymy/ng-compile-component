angular.module('rckd.utils')
	.factory('CompileComponentService', [
		'$rootScope',
		'$compile',
		function($rootScope, $compile) {

			/**
			 * Transforms 'myFancyComponent' to 'my-fancy-component'.
			 *
			 * @param  {String} string
			 * @return {String}
			 */
			const toLowerDash = (string) => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

			return {

				/**
				 * Builds the component's html like:
				 *
				 * <my-fancy-component
				 * 	one-way='$ctrl["one-way"]'
				 * 	two-way='$ctrl["two-way"]'
				 * 	string='{{ $ctrl["string"] }}'
				 * ></my-fancy-component>
				 *
				 * @param  {String} component
				 * @param  {Object} bindings
				 * @return {String}
				 */
				render: (component, bindings) => {
					const tag   = toLowerDash(component);
					const attrs = bindings.reduce((attributes, currentAttr) => {

						const attrString = `${toLowerDash(prop)}=\'(
							${typeof bindings[currentAttr] === 'string'
								? '{{ $ctrl["' + currentAttr + '"] }}' : '$ctrl["' + currentAttr + '"]'})\'`;
						attributes.concat(attrString);

						return attributes;
					}, ' ');

					return `<${tag}${attrs}></${tag}>`;
				},

				/**
				 * Compiles the component.
				 *
				 * @param  {String} component
				 * @param  {Object} bindings
				 * @return {Object}
				 */
				compile: (component, bindings) => {
					const html  = this.render(component, bindings);
					const scope = angular.extend($rootScope.$new(), {
						$ctrl: bindings
					});
					return $compile(html)(scope);
				}

			};

		}
]);
