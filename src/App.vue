<script setup lang="ts">
import { useAccountsStore } from './stores/accounts';
import AccountForm from './components/AccountForm.vue';
import type { AccountRecord } from './types';

const store = useAccountsStore();

const handleUpdate = (account: AccountRecord): void => {
  store.updateAccount(account);
};

const handleDelete = (id: string): void => {
  store.deleteAccount(id);
};

// defineProps<{
// }>();

// defineEmits<{
// }>();
</script>

<template>
  <div class="container">
    <header>
      <h1>Управление учетными записями</h1>
      <button class="add-btn" @click="store.addAccount">+</button>
    </header>

    <div class="help-text">
      Подсказка: Введите метки через точку с запятой (;)
    </div>

    <div class="accounts-list">
      <AccountForm v-for="account in store.accounts" :key="account.id" :account="account" @update="handleUpdate"
        @delete="handleDelete" />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  background-color: #45a049;
}

.help-text {
  margin-bottom: 1rem;
  color: #666;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
