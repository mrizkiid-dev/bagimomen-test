<template>
    <teleport to="#loading" v-if="isLoading">
        <Loading class="absolute z-10"/>
    </teleport>
    <teleport v-if="isEditModalOpen" to='#pop-up'>
        <UModal v-model="isEditModalOpen">
            <div class="p-7">
                <form @submit.prevent="onEditTodo" class="w-full py-5">
                    <div class="flex flex-col items-start justify-start mr-5">
                        <UInput v-model="todoTitleEdit" class="mb-5 w-[300px]" />
                        <UCheckbox v-model="isCompleted" name="complete" label="complete" class="mb-5"/>
                        <button class="bg-green-500 px-4 py-2 rounded-md">
                            <span class="text-white">add todo</span>
                        </button>
                    </div>
                </form>
            </div>
        </UModal>
    </teleport>

    <main class="flex flex-col items-center justify-center ">
        <form @submit.prevent="onUploadTodo" class="flex flex-row justify-center items-center border w-full py-5">
            <UInput v-model="todoTitle" class="w-[600px] mr-5" />
            <button class="bg-green-500 px-4 py-2 rounded-md">
                <span class="text-white">add todo</span>
            </button>
        </form>

        <div class="w-4/5">
            <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <UInput v-model="search" placeholder="Filter todos..." />
            </div>

            <UTable :columns="columns" :rows="filteredRows" class="w-full">
                <template #name-data="{ row }">
                <span :class="[filteredRows.find(todo => todo.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{ row.name }}</span>
                </template>

                <template #actions-data="{ row }">
                <UDropdown :items="items(row)">
                    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                </UDropdown>
                </template>
            </UTable>
            
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="data?.todos.length ?? 1" />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import TodoService from '~/services/todo_service';
const toast = useToast()

const user = {
    id: 1,
    name: 'rizki',
}

const isLoading = ref(false)

/// fetch-initial-data
const { status ,data, error, execute } = await useAsyncData('get-todos', () => TodoService.getAll({
    userId: user.id
}))
watch(status, () => {
    if(status.value === 'pending') {
        isLoading.value = true
    } else {
        isLoading.value = false
    }
    
})

///
// upload todo
///
const todoTitle = ref('')
const onUploadTodo = async () => {
    try {
        isLoading.value = true
        await TodoService.post({
            todo: todoTitle.value,
            completed: false,
            userId: 1
        })
        toast.add({ title: 'upload success' })
    } catch (error) {
        toast.add({ title: 'upload error' })
    } finally {
        isLoading.value = false
    }

}

///
// Table
///
const columns = [{
  key: 'todo',
  label: 'todo',
  sortable: true
}, {
  key: 'completed',
  label: 'completed',
  sortable: true
}, {
  key: 'actions'
}]

const items = (row: { id: number; todo: string; completed:boolean }) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
        isEditModalOpen.value = true
        idEdit.value = row.id
        todoTitleEdit.value = row.todo
        isCompleted.value = row.completed
    }
  }, {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: async() => await onDelete(row.id)
  }]
]

const onDelete = async(id: number) => {
    try {
        isLoading.value = true
        await TodoService.delete(id)
        toast.add({ title: 'delete success' })
    } catch (error) {
        toast.add({ title: 'delete error'})
    } finally {
        isLoading.value = false
    }
}

// search
const search = ref('')

// pagination
const page = ref(1)
const pageCount = 5

//table-data
const filteredRows = computed(() => {
    const todos = data.value?.todos ?? []
    if (!search.value) {
        const filtered = todos.slice((page.value - 1) * pageCount, (page.value) * pageCount)
        return filtered.sort((a, b) => b.id-a.id)
    }

    const fileterdTodos = todos.filter((todos) => {
        return Object.values(todos).some((value) => {
        return String(value).toLowerCase().includes(search.value.toLowerCase())
        })
    })
    return fileterdTodos.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

///
// edit table
///
const isEditModalOpen = ref(false)
const todoTitleEdit = ref('')
const isCompleted = ref(false)
const idEdit = ref(0)

const onEditTodo = async() => {
    try {
        isLoading.value = true
        await TodoService.patch(idEdit.value, {
            todo: todoTitle.value,
            completed: isCompleted.value
        })
        toast.add({ title: 'edit success' })
    } catch (error) {
        toast.add({ title: 'edit error'})
    } finally {
        isLoading.value = false
        isEditModalOpen.value = false
    }
}

</script>

<style scoped>

</style>