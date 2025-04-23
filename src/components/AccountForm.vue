<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AccountRecord, ValidationErrors } from '@/types';

const props = defineProps<{
    account: AccountRecord;
}>();

const emit = defineEmits<{
    (e: 'update', account: AccountRecord): void;
    (e: 'delete', id: string): void;
}>();

const errors = ref<ValidationErrors>({});

const localAccount = ref({ ...props.account });

const labelsString = ref(props.account.labels.map(label => label.text).join(';'));

watch(() => props.account, (newVal) => {
    localAccount.value = { ...newVal };
}, { deep: true });

watch(() => props.account.labels, (newVal) => {
    labelsString.value = newVal.map(label => label.text).join(';');
});

const validateAccount = () => {
    const newErrors: ValidationErrors = {};

    if (!localAccount.value.login || localAccount.value.login.length > 100) {
        newErrors.login = true;
    }

    if (localAccount.value.type === 'LOCAL' && (!localAccount.value.password || localAccount.value.password.length > 100)) {
        newErrors.password = true;
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

const handleUpdate = () => {
    if (validateAccount()) {
        emit('update', localAccount.value);
    }
};

const handleTypeChange = () => {
    localAccount.value.type = localAccount.value.type;
    if (localAccount.value.type === 'LDAP') {
        localAccount.value.password = null;
    } else {
        localAccount.value.password = '';
    }

    // Добавляем setTimeout, чтобы дождаться появления overlay
    setTimeout(() => {
        console.log('Добавляем setTimeout');
        const overlay = document.querySelector('body > div.v-overlay-container');
        if (overlay) {
            console.log('v-overlay-container найден:', overlay);
            console.log('Содержимое:', overlay.innerHTML);
        } else {
            console.log('v-overlay-container не найден');
        }
    }, 100);

    emit('update', localAccount.value);
};

const handleLabelsChange = (value: string) => {
    if (value.length <= 50) {
        labelsString.value = value;
        emit('update', {
            ...localAccount.value,
            labels: value
                .split(';')
                .filter(label => label.trim())
                .map(label => ({ text: label.trim() }))
        });
    }
};
</script>

<template>
    <v-card class="account-form pa-4 ma-2">
        <v-form @submit.prevent>
            <div class="form-grid">
                <!-- Левая колонка -->
                <div class="left-column">
                    <v-text-field v-model="labelsString" @blur="handleLabelsChange($event.target.value)" label="Метка"
                        placeholder="Введите метки через ;" variant="outlined" density="comfortable"></v-text-field>

                    <v-select v-model="localAccount.type" @click="handleTypeChange()" :items="[
                        { title: 'LDAP', value: 'LDAP' },
                        { title: 'Локальная', value: 'LOCAL' }
                    ]" label="Тип записи" variant="outlined" density="comfortable"></v-select>
                </div>

                <!-- Правая колонка -->
                <div class="right-column">
                    <div class="credentials-container">
                        <v-text-field v-model="localAccount.login" :error="errors.login" @blur="handleUpdate"
                            label="Логин" maxlength="100" required variant="outlined"
                            density="comfortable"></v-text-field>

                        <v-text-field v-if="localAccount.type === 'LOCAL'" v-model="localAccount.password"
                            :error="errors.password" type="password" @blur="handleUpdate" label="Пароль" maxlength="100"
                            required variant="outlined" density="comfortable"></v-text-field>

                        <v-btn icon="mdi-delete" color="error" variant="text" density="comfortable"
                            class="delete-button" @click="emit('delete', localAccount.id)"></v-btn>
                    </div>
                </div>
            </div>
        </v-form>
    </v-card>
</template>

<style scoped>
.account-form {
    width: 100%;
    margin: 0 auto;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.left-column {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 16px;
}

.right-column {
    display: flex;
    flex-direction: column;
}

.credentials-container {
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.delete-button {
    flex: 0 0 auto;
}

@media (max-width: 959px) {
    .form-grid {
        grid-template-columns: 1fr;
    }


    .delete-button {
        align-self: flex-start;
    }
}

@media (max-width: 450px) {}
</style>