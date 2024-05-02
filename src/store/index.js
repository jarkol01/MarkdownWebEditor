import { createStore } from 'vuex'

export default createStore({
  state: {
    notes: {
      selectedNoteId: null,
    },
  },
  getters: {
    selectedNoteId: (state) => {
      return state.notes.selectedNoteId
    },
    isNoteSelected: (state) => {
      return state.notes.selectedNoteId !== null
    },
  },
  mutations: {
    setSelectedNoteId(state, noteId) {
      state.notes.selectedNoteId = noteId
    },
  },
})