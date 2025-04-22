import { defineStore } from 'pinia';
import type { AccountRecord, Label } from '@/types';

interface State {
  accounts: AccountRecord[];
}

export const useAccountsStore = defineStore('accounts', {
  state: (): State => ({
    accounts: []
  }),
  
  actions: {
    addAccount() {
      this.accounts.push({
        id: crypto.randomUUID(),
        labels: [],
        type: 'LOCAL',
        login: '',
        password: ''
      });
    },

    updateAccount(account: AccountRecord) {
      const index = this.accounts.findIndex(a => a.id === account.id);
      if (index !== -1) {
        this.accounts[index] = account;
      }
    },

    deleteAccount(id: string) {
      this.accounts = this.accounts.filter(account => account.id !== id);
    },

    setLabels(accountId: string, labelsString: string) {
      const account = this.accounts.find(a => a.id === accountId);
      if (account) {
        account.labels = labelsString
          .split(';')
          .filter(label => label.trim())
          .map(label => ({ text: label.trim() }));
      }
    }
  },

  persist: true
}); 