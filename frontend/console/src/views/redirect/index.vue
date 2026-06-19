<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { params, query } = route
console.log(params)
console.log(query)
const { path } = params
router.replace({ path: `/${path}`, query })
</script>
<template>
  <div></div>
</template>