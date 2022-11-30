<script type="typescript">
  export let color: 'red' | 'white' | 'black';
  export let callBack: Function = null;
  export let applyClass = '';
  export let disabled = false;
  export let size: 'md' | 'lg' = 'md';

  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600 text-slate-200",
    white: "bg-slate-200 text-black",
    black: "bg-slate-900 hover:bg-slate-800 text-slate-200"
  }

  const sizeClasses = {
    md: 'p-3 text-lg',
    lg: 'px-8 pb-3 pt-2 text-2xl hover:scale-110 transition-transform duration-100'
  }
</script>

<button 
  class="p-3 font-bold text-lg disabled:bg-slate-500 
    {applyClass} {colorClasses[color]} {sizeClasses[size]}"
  on:click={callBack && callBack()} disabled={disabled}>
  <slot></slot>
</button>
