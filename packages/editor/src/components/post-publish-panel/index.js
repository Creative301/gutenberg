/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { IconButton, Spinner, CheckboxControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal Dependencies
 */
import PostPublishButton from '../post-publish-button';
import PostPublishPanelPrepublish from './prepublish';
import PostPublishPanelPostpublish from './postpublish';

class PostPublishPanel extends Component {
	constructor() {
		super( ...arguments );
		this.onSubmit = this.onSubmit.bind( this );
		this.state = {
			loading: false,
			submitted: false,
		};
	}

	static getDerivedStateFromProps( props, state ) {
		if (
			state.submitted ||
			props.isSaving ||
			( ! props.isPublished && ! props.isScheduled )
		) {
			return null;
		}

		return {
			submitted: true,
			loading: false,
		};
	}

	componentDidUpdate( prevProps ) {
		// Automatically collapse the publish sidebar when a post
		// is published and the user makes an edit.
		if ( prevProps.isPublished && ! this.props.isSaving && this.props.isDirty ) {
			this.props.onClose();
		}
	}

	onSubmit() {
		const { onClose, hasPublishAction } = this.props;
		if ( ! hasPublishAction ) {
			onClose();
			return;
		}
		this.setState( { loading: true } );
	}

	onUpdateDisableToggle() {
		// There should be a setting to allow users to skip the pre-publish step forever.
		// When a user toggles this option on, their setting will be saved and they won't need
		// to press two "publish" buttons in order to make a post happen.
	}

	render() {
		const { isScheduled, onClose, forceIsDirty, forceIsSaving, PrePublishExtension, PostPublishExtension, ...additionalProps } = this.props;
		const { loading, submitted, hasPublishAction } = this.state;
		return (
			<div className="editor-post-publish-panel" { ...additionalProps }>
				<div className="editor-post-publish-panel__header">
					<strong className="editor-post-publish-panel__title">
						{ hasPublishAction ? __( 'Ready to submit for review?' ) : __( 'Ready to publish?' ) }
					</strong>
					<IconButton
						aria-expanded={ true }
						onClick={ onClose }
						icon="no-alt"
						label={ __( 'Close panel' ) }
					/>
				</div>
				<div className="editor-post-publish-panel__content">
					{ ! loading && ! submitted && (
						<PostPublishPanelPrepublish>
							{ PrePublishExtension && <PrePublishExtension /> }
						</PostPublishPanelPrepublish>
					) }
					{ loading && ! submitted && <Spinner /> }
					{ submitted && (
						<PostPublishPanelPostpublish>
							{ PostPublishExtension && <PostPublishExtension /> }
						</PostPublishPanelPostpublish>
					) }
				</div>

				<div className="editor-post-publish-panel__action-buttons">
					{ ! submitted && (
						<div className="editor-post-publish-panel__header-publish-button">
							<PostPublishButton focusOnMount={ true } onSubmit={ this.onSubmit } forceIsDirty={ forceIsDirty } forceIsSaving={ forceIsSaving } />
						</div>
					) }
					{ submitted && (
						<div className="editor-post-publish-panel__header-published">
							{ isScheduled ? __( 'Scheduled' ) : __( 'Published' ) }
						</div>
					) }
				</div>

				<div className="editor-post-publish-panel__disable-check">
					<CheckboxControl
						label={ __( 'Don’t show this again' ) }
						checked={ false }
						onChange={ () => this.onUpdateDisableToggle() }
					/>
				</div>

			</div>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const {
			getCurrentPost,
			getCurrentPostType,
			isCurrentPostPublished,
			isCurrentPostScheduled,
			isSavingPost,
			isEditedPostDirty,
		} = select( 'core/editor' );
		return {
			postType: getCurrentPostType(),
			hasPublishAction: get( getCurrentPost(), [ '_links', 'wp:action-publish' ], false ),
			isPublished: isCurrentPostPublished(),
			isScheduled: isCurrentPostScheduled(),
			isSaving: isSavingPost(),
			isDirty: isEditedPostDirty(),
		};
	} ),
] )( PostPublishPanel );
