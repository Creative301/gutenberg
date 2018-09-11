/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Dropdown, Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ImportForm from '../import-form';

function ImportDropdown( { onUpload } ) {
	return (
		<Dropdown
			position="bottom right"
			contentClassName="list-reusable-blocks-import-dropdown__content"
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					type="button"
					aria-expanded={ isOpen }
					onClick={ onToggle }
					isPrimary
				>
					{ __( 'Import from JSON' ) }
				</Button>
			) }
			renderContent={ () => <ImportForm onUpload={ onUpload } /> }
		/>
	);
}

export default ImportDropdown;
