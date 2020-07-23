import { animation, animate, query, sequence, style } from '@angular/animations';

export const newMessageAnimation = animation([
  style({
    height: 0,
    width: '5px'
  }),
  query('.cover-anim', [
    style({
      opacity: 1
    })
  ]),
  sequence([
    animate('0.15s 400ms ease-out', style({
      height: '*',
      width: '5px'
    })),
    animate('0.3s 0ms ease-out', style({
      height: '*',
      width: '*'
    })),
    query('.cover-anim', [
      style({
        opacity: 1
      }),
      sequence([
        animate('1s 0ms ease-out', style({
          opacity: 0
        }))
      ])
    ])
  ])
]);
