<script type="typescript">
  export let type: string;
  export let placeholder = '';
</script>

<input
  class="bg-slate-800 text-slate-200 text-lg md:text-2xl py-1 px-3 flex-grow text-ellipsis shadow-lg"
  placeholder={placeholder}
  type={type}>
