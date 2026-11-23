/* Contenido editable del sitio: lo que Mar cambia desde el Panel › Personalizar la página.
   En el prototipo se guarda en este navegador: «ave-contenido» es lo publicado y «ave-borrador» lo que se está editando.
   En el producto real lo guarda la API en la tabla «contenido». */
window.AVE = (function(){
  const DEF = {
    aviso:{on:true,texto:'Envío gratis desde ₡40.000 · hasta el 31 de dic.'},
    portada:{imagen:'img/hero.jpg',ceja:'Colección Paraíso · Catálogo 2026',titulo:'Piezas que no se repiten',texto:'Pocas unidades por diseño. Encuentra la tuya y pídela por WhatsApp.',boton:'VER EL CATÁLOGO'},
    secciones:[
      {id:'todas',nombre:'Tiras: Lo nuevo y por categoría',on:true},
      {id:'especiales',nombre:'Piezas especiales',on:true},
      {id:'como',nombre:'Cómo comprar',on:true},
      {id:'categorias',nombre:'Categorías',on:true},
      {id:'confianza',nombre:'Envíos, pagos y cambios',on:true},
      {id:'resenas',nombre:'Reseñas',on:true},
      {id:'nosotros',nombre:'Nosotros',on:true},
      {id:'preguntas',nombre:'Preguntas frecuentes',on:true},
      {id:'cierre',nombre:'Escríbenos',on:true}],
    especiales:['ave-28','ave-40','ave-41','ave-44','ave-51','ave-63'],
    confianza:[
      {t:'Envíos a todo el país',p:'Por Correos de Costa Rica'},
      {t:'Pago con SINPE Móvil',p:'Desde la app de tu banco'},
      {t:'Cambios y reembolsos',p:'8 días desde que la recibes'},
      {t:'Empaque de la marca',p:'Con tarjeta escrita a mano por Margarita'}],
    nosotros:{imagen:'img/esparza.jpg',titulo:'Detrás de cada pieza',p1:'Ave del Paraíso nació en Esparza, Puntarenas, en 2025, de una idea de Margarita Vargas: reunir en un solo lugar piezas que no se encuentran en cualquier tienda. Hoy tiene su base en San José.',p2:'Elegimos cada pieza una a una, y de casi ninguna hay más de dos.'},
    preguntas:[
      {q:'¿Cómo pido una o varias piezas?',a:'Toca «Pedir por WhatsApp» en la pieza y se abre el chat con el mensaje ya escrito. Si quieres varias, agrégalas al carrito y toca «Pedir todo por WhatsApp»: el mensaje sale con todas tus piezas y el total. Te confirmamos que estén disponibles.'},
      {q:'¿Cómo envían los pedidos?',a:'Enviamos a todo el país por Correos de Costa Rica, en el empaque de Ave del Paraíso. El envío lo cubre la clienta: unos ₡2.450 dentro del Gran Área Metropolitana y ₡3.350 fuera de ella.'},
      {q:'¿El precio incluye IVA?',a:'Sí. Todos los precios ya incluyen el IVA.'},
      {q:'¿Cómo pago?',a:'Con SINPE Móvil al 8649 4332, a nombre de Margarita Vargas. Envíanos el comprobante por WhatsApp.'},
      {q:'¿Tienen códigos de descuento?',a:'Cuando hay uno, lo escribes en el carrito y el total se actualiza al momento. El código viaja en tu mensaje de WhatsApp. No se suma a los precios de Oportunidades.'},
      {q:'¿Puedo cambiar o devolver una pieza?',a:'Sí. Tienes 8 días desde que la recibes para pedir un cambio o la devolución de tu dinero. La pieza debe volver sin usar y en su empaque.'}],
    cierre:{titulo:'¿Tienes dudas o buscas algo especial?',texto:'Escríbenos y te respondemos personalmente.'},
    contacto:{whatsapp:'50686494332',instagram:'avedelparaiso_91',facebook:'https://www.facebook.com/share/19NVbXVQLt/'},
    privacidad:{actualizada:'[fecha]',bloques:[
      {t:'Quién es responsable de tus datos',p:'Ave del Paraíso, emprendimiento de Margarita Vargas, con base en San José, Costa Rica. Para cualquier consulta sobre tus datos, escríbenos por WhatsApp al 8649 4332 o a [correo de contacto].'},
      {t:'Qué datos recogemos en esta página',p:'No te pedimos crear una cuenta ni guardamos tu nombre, correo o teléfono en esta página. Para mejorar el catálogo registramos de forma anónima qué piezas se ven, qué se busca y cuándo se toca «Pedir», sin datos que te identifiquen. Tu carrito se guarda solo en tu navegador.'},
      {t:'Cuando pides por WhatsApp',p:'Al tocar «Pedir por WhatsApp» se abre una conversación con nosotros. Los datos que nos mandes ahí, como tu nombre, la dirección de envío y el comprobante de pago, los usamos solo para confirmar, cobrar y enviar tu pedido. No los compartimos con nadie, salvo con Correos de Costa Rica para el envío. WhatsApp tiene su propia política de privacidad.'},
      {t:'Cuánto tiempo los guardamos',p:'Los datos de tus pedidos los guardamos el tiempo que exige la ley para efectos contables: [plazo]. Los registros anónimos de visitas se borran después de [plazo].'},
      {t:'Tus derechos',p:'De acuerdo con la Ley 8968, de Protección de la Persona frente al Tratamiento de sus Datos Personales, puedes pedirnos ver, corregir o borrar tus datos. Escríbenos y te respondemos en un plazo de [plazo] días hábiles.'},
      {t:'Cambios a esta política',p:'Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha.'}]},
    codigos:[
      {codigo:'BIENVENIDA10',tipo:'porc',valor:10,alcance:'todo',minimo:0,hasta:'2026-12-31',activo:true},
      {codigo:'NAVIDAD5000',tipo:'monto',valor:5000,alcance:'todo',minimo:30000,hasta:'2026-12-24',activo:true},
      {codigo:'ANILLOS15',tipo:'porc',valor:15,alcance:'Anillos',minimo:0,hasta:'2026-11-30',activo:false}]
  };
  const K_PUB='ave-contenido-3', K_BOR='ave-borrador-3', K_INV='ave-piezas-1';
  const clon=o=>JSON.parse(JSON.stringify(o));
  function leer(k){try{const s=localStorage.getItem(k);return s?JSON.parse(s):null}catch(e){return null}}
  function escribir(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
  function completar(c){const d=clon(DEF);if(!c)return d;for(const k in d)if(c[k]!==undefined)d[k]=c[k];DEF.secciones.forEach((x,i)=>{if(!d.secciones.some(y=>y.id===x.id))d.secciones.splice(Math.min(i,d.secciones.length),0,clon(x))});return d}
  function publicado(){return completar(leer(K_PUB))}
  function borrador(){return completar(leer(K_BOR)||leer(K_PUB))}
  const hoy=()=>new Date().toISOString().slice(0,10);
  function estadoCodigo(c){if(!c.activo)return 'pausado';if(c.hasta&&c.hasta<hoy())return 'vencido';return 'activo'}
  /* items: [{price, antes, cat}] → {ok, descuento, motivo, aplica} */
  function aplicar(codigo,items,lista){
    const c=(lista||[]).find(x=>x.codigo.toUpperCase()===String(codigo||'').trim().toUpperCase());
    if(!c)return {ok:false,motivo:'Ese código no existe. Revisa cómo está escrito.'};
    const e=estadoCodigo(c); if(e!=='activo')return {ok:false,motivo:e==='vencido'?'Ese código ya venció.':'Ese código no está activo por ahora.'};
    const ap=items.filter(i=>!i.antes&&(c.alcance==='todo'||i.cat===c.alcance));
    const base=ap.reduce((s,i)=>s+i.price,0);
    if(!ap.length)return {ok:false,c,motivo:c.alcance==='todo'?'El código no se suma a los precios de Oportunidades.':`Este código es solo para ${c.alcance}.`};
    const sub=items.reduce((s,i)=>s+i.price,0);
    if(c.minimo&&sub<c.minimo)return {ok:false,c,motivo:`Este código aplica desde ${fmt(c.minimo)}.`};
    let d=c.tipo==='porc'?Math.round(base*c.valor/100/100)*100:Math.min(c.valor,base);
    return {ok:true,c,descuento:d,aplica:ap.length,todas:ap.length===items.length};
  }
  const fmt=p=>'₡'+String(Math.round(p)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  const etiqueta=c=>c.tipo==='porc'?`${c.valor} %`:fmt(c.valor);
  return {DEF,K_PUB,K_BOR,K_INV,leer,escribir,publicado,borrador,estadoCodigo,aplicar,fmt,etiqueta,clon};
})();
