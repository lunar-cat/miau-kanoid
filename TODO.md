# Ideas
* Podría hacer que según si el movimiento del mouse es hacia la izquierda o hacia la derecha
eso permita que la velocidad de la bola sea x negativa, o xpositiva, así
permitiendo que el disparo inicial sea hacia la izquierda o derecha
podríamos calcularlo comparando los últimos 2 x del user mouse
## esto anterior debería poderse hacer con la nueva api del [mouse](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API)


* necesitamos reiniciar el juego cuando se mueve la bola, y restar vida, si no quedan vidas GG

## El problema de la detección de colisión es que debería detectar si entre la posición actual y la posición siguiente hay un overlap de x/y para detectar la colisión, porque de lo contrario puede ser que ahora mismo la posición actual no choque, y que la distancia sea de 2px, pero si la velocidad es de 4px, el próximo ya lo atravezará

## Agregar UI también y ordenar las distintas razones de terminar el juego (perder o ganar)

## debería pasar la current y next position, así veo si ahora y a futuro chocará
## insisto, necesitamos el side colliding para la plataforma del usuario, porque o si no la bola seguirá atravesando

## podría hacer que si el click es izquierdo o derecho cambie el inicio de la dirección de la bola, haciendo preventDefault en el contextmenu del click derecho en el canvas

## que tal si cambiamos el X,Y de un bloque, y que estos estén en el centro? y así simplemente vemos is colisiona arriba, abajo o a los lados
## y para ver si está chocando, sumamos la distancia del centro al borde más el radio de la bola, si eso es 0 o menos, pues colisión!
