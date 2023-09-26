import { defineStore } from 'pinia'

export const useOtherStore = defineStore("other", {
    state: () => ({
        isFrom: false,
        text: ''
    }),
    actions: {
        chnageisFrom() {
            this.isFrom = !this.isFrom
        },
        setText(text: string) {
            this.text = text
        }
    },
    getters: {

    }
})