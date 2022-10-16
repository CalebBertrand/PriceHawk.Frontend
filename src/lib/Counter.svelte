<script type='typescript'>
  let count = 0;
  const increment = () => {
    count += 1
  }

  $: squared = count * count;
</script>

<button on:click={increment}>
  squared is {squared}
</button>
