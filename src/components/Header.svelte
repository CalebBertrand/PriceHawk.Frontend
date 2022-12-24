<script type="typescript">
  export let text: string;

  $: parsed = text
    .replace('<em>', '<span class="bg-red-500 text-slate-200 px-3 pb-1 rounded mb-3 leading-normal">')
    .replace('</em>', '</span>');
</script>

<h1 class="text-2xl md:text-5xl font-bold mb-7">
  {@html parsed}
</h1>
