<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    delay = 0,
    as: tag = 'div',
    class: className = '',
    ...rest
  }: {
    children: Snippet;
    delay?: number;
    as?: string;
    class?: string;
    [key: string]: any;
  } = $props();

  let element: HTMLElement | undefined;
  let hidden = $state(false);

  const d = $derived(delay ? `d${delay}` : '');

  $effect(() => {
    const el = element;
    if (!el) return;

    let raf1 = 0;
    let raf2 = 0;
    let t: ReturnType<typeof setTimeout> | undefined;
    let io: IntersectionObserver | null = null;

    const reveal = () => { hidden = false; };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight || 0;
        if (r.top < vh && r.bottom > 0) return;

        hidden = true;

        if (typeof IntersectionObserver === 'undefined') { reveal(); return; }

        io = new IntersectionObserver(
          ([e]) => { if (e.isIntersecting) { reveal(); io!.disconnect(); } },
          { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        io.observe(el);
        t = setTimeout(reveal, 1600);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
      io?.disconnect();
    };
  });
</script>

<svelte:element this={tag} class="reveal {d}{hidden ? ' pre' : ''}{className ? ` ${className}` : ''}" bind:this={element} {...rest}>
  {@render children()}
</svelte:element>
