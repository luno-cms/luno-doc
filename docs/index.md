---
layout: false
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
onMounted(() => {
  const lang = navigator.language?.startsWith('ja') ? '/ja/' : '/en/'
  router.go(lang)
})
</script>

<noscript>
  <meta http-equiv="refresh" content="0; url=/ja/" />
  <p><a href="/ja/">日本語</a> / <a href="/en/">English</a></p>
</noscript>
