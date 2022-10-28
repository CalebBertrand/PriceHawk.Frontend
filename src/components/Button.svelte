<script type="typescript">
  export let color: 'red' | 'white' | 'black';
  export let callBack: Function = null;
  export let applyClass = '';

  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600 text-slate-200",
    white: "bg-slate-200 text-black",
    black: "bg-slate-900 hover:bg-slate-800 text-slate-200"
  }
</script>

<button 
  class="p-3 font-bold text-lg {applyClass} {colorClasses[color]}"
  on:click={callBack && callBack()}>
  <slot></slot>
</button>
