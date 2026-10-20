import { MonoTypeOperatorFunction, tap } from 'rxjs';

export function scrollToEl(
  el: Element,
  {
    instantly = false,
    to = 'end' as ScrollLogicalPosition,
    inline = 'nearest' as ScrollLogicalPosition,
  } = {},
) {
  el.scrollIntoView({
    behavior: instantly ? 'auto' : 'smooth',
    block: to,
    inline,
  });
}

export function logResult<T>(label: string): MonoTypeOperatorFunction<T> {
  return tap((result) => console.log(label + ': ', result));
}

export function isPresent<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
