import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {actions as pasteActions} from '../ducks/pastes';
import {actions as authActions} from '../ducks/auths';

import {Container, Header, Radio, Divider, Button} from 'semantic-ui-react';

import PasteEntry from '../components/PasteEntry';

class HistoryContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.onViewPaste = this.onViewPaste.bind(this);
        this.handleShowAbuse = this.handleShowAbuse.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.admin !== nextProps.admin) return true;
        if(this.props.next !== nextProps.next) return true;
        if(this.props.showSpam !== nextProps.showSpam) return true;

        return this.props.pastes.length !== nextProps.pastes.length;
    }

    componentWillMount() {
        this.props.actions.loadPastes(this.props.showSpam, 0);
    }

    onViewPaste(pasteId) {
        this.context.router.push('/' + pasteId);
    }

    loadMorePastes() {
        this.props.actions.loadMorePastes(this.props.showSpam, this.props.next);
    }

    handleShowAbuse() {
        if(!this.props.showSpam) {
            this.props.actions.showSpamPastes();
        } else {
            this.props.actions.hideSpamPastes();
        }
        this.props.actions.loadPastes(!this.props.showSpam, 0);
    }

    render() {
        const { admin, showSpam, next } = this.props;

        if (!this.props.pastes) {
            return (
                <Header size="large">Loading...</Header>
            );
        }
        let pastes = this.props.pastes;

        if (pastes.length === 0) {
            return (
                <Container fluid>
                    <Header size="large">
                        No pastes found
                    </Header>
                </Container>
            );
        }

        return (
            <Container fluid>
                { admin &&
                    <Radio label="Include Spam Pastes" toggle onClick={this.handleShowAbuse} checked={showSpam} />
                }
                <Divider hidden />
                {pastes.map(paste =>
                    <PasteEntry key={paste.id} paste={paste} lines_to_show={5} onViewPaste={this.onViewPaste}/>
                )}
                <Divider hidden />
                { next !== -1 &&
                    <div>
                        <Button floated="right" onClick={()=>{this.loadMorePastes();}}>Load More</Button>
                        <Divider hidden clearing={true} />
                    </div>
                }
            </Container>
        );
    }
}

HistoryContainer.contextTypes = {
    router: PropTypes.object.isRequired
};

HistoryContainer.propTypes = {
    actions: PropTypes.object.isRequired,
    pastes: PropTypes.array.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators({...pasteActions, ...authActions}, dispatch)};
};

function mapStateToProps(state) {
    let pastes = [];

    if (state.pastes.pasteList.pastes) {
        pastes = state.pastes.pasteList.pastes;
    }

    return {
        pastes: pastes,
        admin: state.auth.admin,
        next: state.pastes.pasteList.next,
        showSpam: state.auth.showSpam,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
