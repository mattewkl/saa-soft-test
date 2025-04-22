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

watch(() => props.account, (newVal) => {
    localAccount.value = { ...newVal };
}, { deep: true });

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
    emit('update', localAccount.value);
};

const handleLabelsChange = (value: string) => {
    if (value.length <= 50) {
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
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field :value="localAccount.labels.map(label => label.text).join(';')"
                            @blur="handleLabelsChange($event.target.value)" label="Метка"
                            placeholder="Введите метки через ;" variant="outlined" density="comfortable"></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-select v-model="localAccount.type" @change="handleTypeChange" :items="[
                            { title: 'LDAP', value: 'LDAP' },
                            { title: 'Локальная', value: 'LOCAL' }
                        ]" label="Тип записи" variant="outlined" density="comfortable"></v-select>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-text-field v-model="localAccount.login" :error="errors.login" @blur="handleUpdate"
                            label="Логин" maxlength="100" required variant="outlined"
                            density="comfortable"></v-text-field>
                    </v-col>

                    <v-col v-if="localAccount.type === 'LOCAL'" cols="12" sm="6">
                        <v-text-field v-model="localAccount.password" :error="errors.password" type="password"
                            @blur="handleUpdate" label="Пароль" maxlength="100" required variant="outlined"
                            density="comfortable"></v-text-field>
                    </v-col>
                </v-row>

                <v-row class="mt-2">
                    <v-col cols="12">
                        <v-btn color="error" @click="emit('delete', localAccount.id)" variant="elevated">
                            Удалить
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-card>
</template>

<style scoped>
.account-form {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}
</style>