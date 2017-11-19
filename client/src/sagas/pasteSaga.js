import {takeEvery, delay} from 'redux-saga';
import {put, call} from 'redux-saga/effects';
import { push } from 'react-router-redux';
import {types} from '../ducks/pastes';
import {types as authTypes} from '../ducks/auths';
// import pasteApi from '../api/mockPasteApi';
import pasteApi from '../api/pasteApi';


export function* loadAllPastes() {
    try {
        const pastes = yield call(pasteApi.getAllPastes);
        yield put({type: types.LOAD_ALL_PASTES_SUCCESS, pastes});
    } catch (error) {
        yield put({type: types.LOAD_ALL_PASTES_ERROR, message: error});
    }
}

export function* loadPastes({abuse, offset}) {
    try {
        const pastes = yield call(pasteApi.getPastes, abuse, offset);
        yield put({type: types.LOAD_PASTES_SUCCESS, payload: pastes});
    } catch (error) {
        yield put({type: types.LOAD_PASTES_ERROR, message: error});
    }
}

export function* loadMorePastes({abuse, offset}) {
    try {
        const paste_data = yield call(pasteApi.getPastes, abuse, offset);
        yield put({type: types.LOAD_MORE_PASTES_SUCCESS, payload: paste_data});
    } catch (error) {
        yield put({type: types.LOAD_MORE_PASTES_ERROR, message: error});
    }
}

export function* savePaste({paste}) {
    try {
        const savedPaste = yield call(pasteApi.savePaste, paste);
        yield put({type: types.SAVE_PASTE_SUCCESS, paste: savedPaste});
    } catch (error) {
        yield put({type: types.SAVE_PASTE_ERROR, message: error});
    }
}

export function* loadPaste({pasteId}) {
    try {
        const paste = yield call(pasteApi.getPaste, pasteId);
        yield put({type: types.LOAD_PASTE_SUCCESS, paste});
    } catch (error) {
        yield put({type: types.LOAD_PASTE_ERROR, message: error});
    }
}

export function* deletePaste({pasteId}) {
    try {
        yield call(pasteApi.deletePaste, pasteId);
        yield put({type: types.DELETE_PASTE_SUCCESS, pasteId});
    } catch (error) {
        yield put({type: types.DELETE_PASTE_ERROR, message: error});
    }
}

export function* changePasteAbuse({pasteId, abuse}) {
    try {
        yield call(pasteApi.changePasteAbuse, pasteId, abuse);
        yield put({type: authTypes.CHANGE_PASTE_ABUSE_SUCCESS, pasteId});
    } catch (error) {
        yield put({type: authTypes.CHANGE_PASTE_ABUSE_ERROR, message: error});
    }
}

export function* checkAdmin({adminKey}) {
    try {
        const admin_response = yield call(pasteApi.checkAdmin, adminKey);
        if(admin_response.data.admin === true) {
            localStorage.setItem("userToken", adminKey);
            localStorage.setItem("admin", true);
            yield put({type: authTypes.CHECK_ADMIN_SUCCESS, payload: {
                admin: true
            }});
        } else {
            yield put({type: authTypes.CHECK_ADMIN_FAILURE});
        }
    } catch (error) {
        yield put({type: authTypes.CHECK_ADMIN_ERROR, message: error});
    }
}

export function logoutAdmin() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("admin");
}

export function* watchCheckAdmin() {
    yield* takeEvery(authTypes.CHECK_ADMIN, checkAdmin);
}

export function* watchLogoutAdmin() {
    yield* takeEvery(authTypes.LOGOUT_ADMIN, logoutAdmin);
}

export function* watchChangePasteAbuse() {
    yield* takeEvery(authTypes.CHANGE_PASTE_ABUSE, changePasteAbuse);
}

export function* pasteAbuseFlagTimer() {
    yield call(delay, 5000);
    yield put({type: authTypes.CHANGE_PASTE_ABUSE_CLEAR});
}

export function* watchChangePasteAbuseFlag() {
    yield* takeEvery(authTypes.CHANGE_PASTE_ABUSE_SUCCESS, pasteAbuseFlagTimer);
}

export function* watchPasteHistory() {
    yield* takeEvery(types.LOAD_ALL_PASTES, loadAllPastes);
}

export function* watchLoadPastes() {
    yield* takeEvery(types.LOAD_PASTES, loadPastes);
}

export function* watchLoadMorePastes() {
    yield* takeEvery(types.LOAD_MORE_PASTES, loadMorePastes);
}

export function* watchLoadPaste() {
    yield* takeEvery(types.LOAD_PASTE, loadPaste);
}

export function* watchSavePaste() {
    yield* takeEvery(types.SAVE_PASTE, savePaste);
}

export function* watchDeletePaste() {
    yield* takeEvery(types.DELETE_PASTE, deletePaste);
}


export const sagas = [
    watchPasteHistory(),
    watchLoadPastes(),
    watchLoadPaste(),
    watchSavePaste(),
    watchDeletePaste(),
    watchCheckAdmin(),
    watchLogoutAdmin(),
    watchChangePasteAbuse(),
    watchLoadMorePastes(),
    watchChangePasteAbuseFlag(),
];