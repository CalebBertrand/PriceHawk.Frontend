<script type="typescript">
  export let color: 'red' | 'white' | 'black' | 'green';
  export let callBack: Function = null;
  export let applyClass = '';
  export let disabled = false;
  export let size: 'md' | 'lg' = 'md';

  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600 text-slate-200 disabled:bg-slate-500",
    white: "border-2 border-slate-200 bg-transparent text-slate-200 disabled:border-slate-400 disabled:text-slate-400",
    black: "bg-slate-900 hover:bg-slate-800 text-slate-200 disabled:bg-slate-500",
    green: "bg-green-500 hover:bg-green-400 text-slate-200 disabled:bg-green-400"
  }

  const sizeClasses = {
    md: 'p-3 text-lg md:text-xl',
    lg: 'px-8 pb-3 pt-2 text-xl md:text-2xl hover:scale-110 transition-transform duration-100'
  }
</script>

<button 
  class="p-3 font-bold
    {applyClass} {colorClasses[color]} {sizeClasses[size]}"
  on:click={callBack && callBack()} disabled={disabled}>
  <slot></slot>
</button>
