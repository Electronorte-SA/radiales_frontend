// import * as SQLite from "expo-sqlite";
import SQLite from 'react-native-sqlite-storage';

import axios from 'axios';
const db = SQLite.openDatabase('dbradiales.db');

export const initializeDatabase = () => {
  db.transaction(tx => {
    // Crear la tabla 'radialesQR' si no existe
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS radialesQR (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'codigo TEXT, ' +
        'se TEXT, ' +
        'amt TEXT, ' +
        'marca TEXT, ' +
        'modelo_de_rele TEXT, ' +
        'nombre_de_radial TEXT, ' +
        'nivel_de_tension_kv REAL, ' +
        'tipo TEXT, ' +
        'propietario TEXT, ' +
        'latitud REAL, ' +
        'longitud REAL, ' +
        'fec_instala TEXT, ' +
        'estado TEXT, ' +
        'fec_camb_bateria TEXT, ' +
        'creado_en TEXT DEFAULT CURRENT_TIMESTAMP, ' +
        'actualizado_en TEXT DEFAULT CURRENT_TIMESTAMP)',
    );

    // Crear la tabla 'parametrosqr' si no existe
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS parametrosqr (' +
        'NOMBRE TEXT,' +
        'VALOR TEXT' +
        ')',
    );

    // Consultar si existe una entrada con nombre 'ULT_ACT' en la tabla 'parametrosqr'
    tx.executeSql(
      'SELECT * FROM parametrosqr WHERE nombre=?',
      ['ULT_ACT'],
      (_, {rows}) => {
        // console.log("las consultas de select de la fecha", rows);
        if (rows.length == 0) {
          // Si no existe, insertar un nuevo registro con 'ULT_ACT' como nombre y valor vacío
          tx.executeSql(
            'INSERT INTO parametrosqr (NOMBRE, VALOR) VALUES (?, ?)',
            ['ULT_ACT', ''],
            (_, result) => {
              console.log(
                'Registro insertado con éxito en la tabla parametrosqr',
              );
            },
            (_, error) => {
              console.error(
                'Error al insertar el registro en la tabla parametrosqr:',
                error,
              );
            },
          );
        }
      },
      (_, error) => {
        console.error('error', error);
      },
    );

    // Crear la tabla 'subestaciones' si no existe
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS subestaciones (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'provincia TEXT, ' +  
        'distrito TEXT, ' + //estte
        'direccion TEXT, ' + //este columna vamos a trabaja en las busquedad
        'u_negocio TEXT, ' +
        'amt TEXT, ' +  //este columna vamos a trabaja en las busquedad
        'sed TEXT, ' + //este columna vamos a trabaja en las busquedad
        'fecha_instalacion DATE, ' +
        'tipo TEXT, ' +
        'propietario TEXT, ' +
        'direccion2 TEXT, ' +
        'coordenadas TEXT, ' +
        'transformador TEXT, ' +
        'creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
        'modificado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
    );

    console.log("Tabla 'subestaciones' creada correctamente");

    // Crear la tabla 'parametrosqrsubestaciones' si no existe y realizar la consulta
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS parametrosqrsubestaciones (' +
        'NOMBRE TEXT,' +
        'VALOR TEXT' +
        ')',
    );

    tx.executeSql(
      'SELECT * FROM parametrosqrsubestaciones WHERE nombre=?',
      ['ULT_ACT'],
      (_, { rows }) => {
        if (rows.length == 0) {
          tx.executeSql(
            'INSERT INTO parametrosqrsubestaciones (NOMBRE, VALOR) VALUES (?, ?)',
            ['ULT_ACT', ''],
            (_, result) => {
              console.log('Registro insertado con éxito en la tabla parametrosqrsubestaciones');
            },
            (_, error) => {
              console.error('Error al insertar el registro en la tabla parametrosqrsubestaciones:', error);
            }
          );
        }
      },
      (_, error) => {
        console.error('Error al realizar la consulta en la tabla parametrosqrsubestaciones:', error);
      }
    );

    // Consultar datos de la tabla 'parametrosqr'
    tx.executeSql(
      'SELECT * FROM parametrosqr',
      [],
      (_, result) => {
        console.log('los datos de la consulta', result);
        const rows = result.rows;
        for (let i = 0; i < rows.length; i++) {
          const item = rows.item(i);
          // console.log("Fila", i + 1, ":", item);
          // console.log("NOMBRE:", item.NOMBRE, "VALOR:", item.VALOR);
        }
      },
      (_, error) => {
        console.error(
          'Error al obtener los datos de la tabla parametrosqr:',
          error,
        );
      },
    );

    // eliminarDatos();
    contar();
    contarsubestaciones();
  });
  
};
//lasnfwchas de radiales
export function getParametroFecha() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM parametrosqr WHERE nombre=?',
        ['ULT_ACT'],
        (_, {rows}) => {
          console.log("las consultas de select de la fecha de radiales ", rows);
          const registro = rows.item(0).VALOR;

          resolve(registro);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}
export function getParametroFechaSubestaciones() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM parametrosqrsubestaciones WHERE nombre=?',
        ['ULT_ACT'],
        (_, {rows}) => {
          
          console.log("las consultas de select de la fecha de SUBESTACIONES ", rows);
          const registro = rows.item(0).VALOR;
          resolve(registro);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function getRadialById(inputID) {
  console.log('el imput', inputID);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM radialesQR where codigo=?',
        [inputID],
        (_, {rows}) => {
          if (rows.length > 0) {
            const registro = rows.item(0);

            resolve(registro);
          } else {
            resolve({id: 'No encontrado'});
          }
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export const handleDelete = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM radialesQR',

      [],
      (_, result) => {
        console.log('Datos eliminados con éxito de la tabla radialesQR.');
      },
      (_, error) => {
        console.error(
          'Error al eliminar los datos de la tabla radialesQR:',
          error,
        );
      },
    );
  });

  contar();
};
//////////////////////////////////////////////////apisssssssssssssssss

export const fetchToken = () => {
  const apiUrl = 'https://radialesqr.azurewebsites.net/token';
  const apiKey = 'mama'; // Código a enviar en el cuerpo de la solicitud

  return new Promise((resolve, reject) => {
    axios
      .post(apiUrl, {idapp: apiKey})
      .then(response => {
        const generatedToken = response.data.token;
        resolve(generatedToken);
      })
      .catch(error => {
        reject(error);
      });
  });
};

//get de radiales 
export const fetchDataSync = (generatedToken, fecha_busqueda) => {
  return new Promise((resolve, reject) => {
    const otherApiUrl = `https://radialesqr.azurewebsites.net/radialesqr?fecha_busqueda=${fecha_busqueda}`;
    axios
      .get(otherApiUrl, {
        headers: {
          Authorization: `Bearer ${generatedToken}`,
        },
      })

      .then(otherApiResponse => {
        const dataFromAPI = otherApiResponse.data;
        // console.log('LOS DATOS DE LA APIS:', dataFromAPI.radiales)
        resolve(otherApiResponse.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// get de subestaciones 
// const fecha_busqueda_subestaciones = '2024-01-03 23:41:00';
export const fetchSubestacionesDataSync = (generatedToken, fecha_busqueda_subestaciones) => {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://radialesqr.azurewebsites.net/subestaciones?fecha_busqueda_subestaciones=${fecha_busqueda_subestaciones}`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${generatedToken}`,
        },
      })
      .then(response => {
        const dataFromAPI = response.data;
        // console.log('Datos de la API de subestaciones:', dataFromAPI);  // Imprimir datos en la consola
        resolve(dataFromAPI);
      })
      .catch(error => {
        console.error('Error al obtener los datos de la API de subestaciones:', error); // Imprimir error en la consola
        reject(error);
      });
  });
};

///////////actuacion de fechas de radiales 
const actualizarFechaEnParametrosQR = fecha => {
  return new Promise((resolve, reject) => {
    console.log('Fecha a actualizar:', fecha);
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE parametrosqr SET VALOR=? WHERE NOMBRE=?',
        [fecha, 'ULT_ACT'],
        (_, result) => {
          console.log('Resultado de la actualización:', result);
          console.log(
            'Fecha actualizada con éxito en la tabla parametrosqr:',
            fecha,
          );
          resolve('Éxito al actualizar la fecha');
        },
        (_, error) => {
          console.error(
            'Error al actualizar la fecha en la tabla parametrosqr:',
            error,
          );
          reject('Error al actualizar la fecha');
        },
      );
    });
  });
};

//actualizacon de fecha de subestacciones 
const actualizarFechaEnParametrosQRSubestaciones = fecha => {
  return new Promise((resolve, reject) => {
    console.log('Fecha a actualizar en parametrosqrsubestaciones:', fecha);
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE parametrosqrsubestaciones SET VALOR=? WHERE NOMBRE=?',
        [fecha, 'ULT_ACT'],
        (_, result) => {
          console.log('Resultado de la actualización en parametrosqrsubestaciones:', result);
          console.log(
            'Fecha actualizada con éxito en la tabla parametrosqrsubestaciones:',
            fecha,
          );
          resolve('Éxito al actualizar la fecha en parametrosqrsubestaciones');
        },
        (_, error) => {
          console.error(
            'Error al actualizar la fecha en la tabla parametrosqrsubestaciones:',
            error,
          );
          reject('Error al actualizar la fecha en parametrosqrsubestaciones');
        },
      );
    });
  });
};

///////////////////////////////insertarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
export const insertRadiales = data => {
  return new Promise((resolve, reject) => {
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    const insertPromises = batches.map(batch => {
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            batch.forEach(item => {
              tx.executeSql(
                'INSERT INTO radialesQR (codigo, se, amt, marca, modelo_de_rele, nombre_de_radial, nivel_de_tension_kv, tipo, propietario, latitud, longitud, fec_instala, estado, fec_camb_bateria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                  item.codigo,
                  item.se,
                  item.amt,
                  item.marca,
                  item.modelo_de_rele,
                  item.nombre_de_radial,
                  item.nivel_de_tension_kv,
                  item.tipo,
                  item.propietario,
                  item.latitud,
                  item.longitud,
                  item.fec_instala,
                  item.estado,
                  item.fec_camb_bateria,
                ],
                (_, result) => {},
              );
            });
          },
          txError => {
            reject(txError);
          },
          () => {
            resolve(true);
          },
        );
      });
    });

    Promise.all(insertPromises)
      .then(() => {
        resolve('Inserción de datos completa');
      })
      .catch(error => {
        reject(`Error al insertar datos: ${error}`);
      });
  });
};


///inserta las subestaciones 
export const insertSubestaciones = data => {
  console.log('has lllegado al metodo de datos', data.length)
  return new Promise((resolve, reject) => {  
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    
  console.log('has lllegado al metodo de batches', batches.length)

    const insertPromises = batches.map(batch => {
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            batch.forEach(item => {
              tx.executeSql(
                'INSERT INTO subestaciones (provincia, distrito, direccion, u_negocio, amt, sed, fecha_instalacion, tipo, propietario, direccion2, coordenadas, transformador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                  item.provincia,
                  item.distrito,
                  item.direccion,
                  item.u_negocio,
                  item.amt,
                  item.sed,
                  item.fecha_instalacion,
                  item.tipo,
                  item.propietario,
                  item.direccion2,
                  item.coordenadas,
                  item.transformador,
                ],
                (_, result) => {},
              );
            });
          },
          txError => {
            reject(txError);
          },
          () => {
            resolve(true);
          },
        );
      });
    });

    Promise.all(insertPromises)
      .then(() => {
        resolve('Inserción los datos de subestacciones  completa');
      })
      .catch(error => {
        reject(`Error al insertar subestacciones datos: ${error}`);
      });
  });
};


export const updateRadiales = data => {
  return new Promise((resolve, reject) => {
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    const updatePromises = batches.map(batch => {
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            batch.forEach(item => {
              tx.executeSql(
                'UPDATE radialesQR SET codigo = ?, se = ?, amt = ?, marca = ?, modelo_de_rele = ?, nombre_de_radial = ?, nivel_de_tension_kv = ?, tipo = ?, propietario = ?, latitud = ?, longitud = ?, fec_instala = ?, estado = ?, fec_camb_bateria = ? WHERE id = ?',
                [
                  item.codigo,
                  item.se,
                  item.amt,
                  item.marca,
                  item.modelo_de_rele,
                  item.nombre_de_radial,
                  item.nivel_de_tension_kv,
                  item.tipo,
                  item.propietario,
                  item.latitud,
                  item.longitud,
                  item.fec_instala,
                  item.estado,
                  item.fec_camb_bateria,
                  parseInt(item.id, 10),
                ],
                (_, result) => {
                  // Registro actualizado con ID
                },
                txError => {
                  reject(txError);
                },
              );
            });
          },
          txError => {
            reject(txError);
          },
          () => {
            resolve();
          },
        );
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        resolve('Actualización de datos completa');
      })
      .catch(error => {
        reject(`Error al actualizar datos: ${error}`);
      });
  });
};
export const updateSubestaciones = data => {
  return new Promise((resolve, reject) => {
    const batchSize = 10;
    const batches = [];
    
    // Dividir los datos en lotes
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    // Mapa de promesas para los lotes de actualización
    const updatePromises = batches.map(batch => {
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            batch.forEach(item => {
              tx.executeSql(
                'UPDATE subestaciones SET provincia = ?, distrito = ?, direccion = ?, u_negocio = ?, amt = ?, sed = ?, fecha_instalacion = ?, tipo = ?, propietario = ?, direccion2 = ?, coordenadas = ?, transformador = ? WHERE id = ?',
                [
                  item.provincia,
                  item.distrito,
                  item.direccion,
                  item.u_negocio,
                  item.amt,
                  item.sed,
                  item.fecha_instalacion,
                  item.tipo,
                  item.propietario,
                  item.direccion2,
                  item.coordenadas,
                  item.transformador,
                  parseInt(item.id, 10), // Convertir el ID a entero
                ],
                (_, result) => {
                  // Registro actualizado con ID
                },
                txError => {
                  reject(txError);
                },
              );
            });
          },
          txError => {
            reject(txError);
          },
          () => {
            resolve();
          },
        );
      });
    });

    // Esperar a que todas las promesas de actualización se resuelvan
    Promise.all(updatePromises)
      .then(() => {
        resolve('Actualización de datos completa');
      })
      .catch(error => {
        reject(`Error al actualizar datos: ${error}`);
      });
  });
};
//////////////////////////////////////////mainnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
export const handleSync = async (generatedToken) => {
  try {
    //  let exito_insertar = await insertBatchIntoDB(data);
    let fecha_busqueda = await getParametroFecha();

    // let fecha_busqueda = '2023-11-13 17:20:00';
   
    // console.log('la fecha actualizada busqueda', fecha_busqueda);
    // console.log('vhbjnkl',generatedToken)
    let data = await fetchDataSync(generatedToken, fecha_busqueda);

    ///////////////////raduiales//////////////////////////////////////////////////////
    if (data) {
      if (fecha_busqueda === '') {
        if (data.radiales) {
          let exito_insertar = await insertRadiales(data.radiales);
          console.log('subestaciones con existos de boton en insertado', exito_insertar);
        }
      } else {
        if (data) {
          if (data.radiales) {
            let dataInsertar = data.radiales.filter(
              item => (item.accion = 'insertar'),
            );

            let dataActualizar = data.radiales.filter(
              item => (item.accion = 'actualizar'),
            );

            if (dataInsertar) {
              let exito_insertar = await insertRadiales(dataInsertar);

              // console.log('datos isertados por la fecha',exito_insertar)
            }

            if (dataActualizar) {
              let exito_actualizar = await updateRadiales(dataActualizar);
                 }
          }
        }
      }
    }
    
    ///////////////LA FECHA DE RADIALES 
    let fecha = data.fecha;

    if (fecha) {
      let la_fecha_actualida = await actualizarFechaEnParametrosQR(fecha);
      console.log('la fecha fue actualiz a', la_fecha_actualida);
    }



  } catch (ex) {
    console.error(ex);
  }
  // const fecha_busqueda = '2023-10-24 8:30:00';
};



// lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll]

export const handleSyncportodos = async (generatedToken) => {
  try {

// // variables de datos 22222222222
    let fecha_busqueda_subestacciones =   await getParametroFechaSubestaciones(  );
//  let fecha_busqueda_subestacciones = "";
    
// console.log('fechas de subestaciones va',fecha_busqueda_subestacciones)
    
    let data2 = await fetchSubestacionesDataSync(generatedToken, fecha_busqueda_subestacciones);
    
    ///////////////LA SUBESTACIONES 

    if (data2) {
      if (fecha_busqueda_subestacciones === '') {
        console.log('paso subestaciones  2');
        if (data2.subestaciones) {
          console.log('pasosubestaciones  3'); 
          let exito_insertar_subestacionnes = await insertSubestaciones(data2.subestaciones);
        }   
      }
    }
    ///////////////LA FECHA DE SUBESTACIONES
    let fecha_subetaciones = data2.fecha;
    if (fecha_subetaciones) {
      let la_fecha_actualida_subetaciones = await actualizarFechaEnParametrosQRSubestaciones(fecha_subetaciones);
      // console.log('la fecha fue actualiz de subestaciones ', la_fecha_actualida_subetaciones);
    }


  } catch (ex) {
    console.error(ex);
  }
};


//por paramentro de fecha
export const handleSyncSub = async (generatedToken) => {
  try {
    
 let fecha_busqueda_subestacciones = await getParametroFechaSubestaciones(  );
//  let fecha_busqueda_subestacciones = "";
    let fecha = data.fecha;
    let data2 = await fetchSubestacionesDataSync(generatedToken, fecha_busqueda_subestacciones);
    // console.log('todos mm los datos subtaciones',data2.subestaciones)

  if (data2) {
          console.log('paso 4 subestaciones');
          if (data2.subestaciones) {
            console.log('paso 5 subestaciones');
            let dataInsertar = data2.subestaciones.filter(
              item => (item.accion = 'insertar'),
            );

            console.log('paso 6 subestaciones');
            let dataActualizar_sub = data2.radiales.filter(
              item => (item.accion = 'actualizar'),
            );

            console.log('paso 7 subestaciones');
            if (dataInsertar) {
              let exito_insertar = await insertSubestaciones(dataInsertar);

              // console.log('datos isertados por la fecha',exito_insertar)
            }

            console.log('paso 8');
            if (dataActualizar_sub) {
              let exito_actualizar = await updateSubestaciones(dataActualizar_sub);
              console.log('paso 9');
              console.log('datos de subestaciones', exito_actualizar);
            }
          }
        }
    /////////////////////////////////////////
    let fecha_subetaciones = data2.fecha;

    if (fecha_subetaciones) {
      let la_fecha_actualida_subetaciones = await actualizarFechaEnParametrosQRSubestaciones(fecha);
      console.log('la fecha fue actualiz de subestaciones ', la_fecha_actualida_subetaciones);
    }
  } catch (ex) {
    console.error(ex);
  }
  // const fecha_busqueda = '2023-10-24 8:30:00';
};

//bonessssssssssssssssssssssssssss

export function handleSearchButton() {
  console.log('entro');
  db.transaction(tx => {
    // Suponiendo que 'inputID' contiene el ID ingresado por el usuario
    tx.executeSql(
      'SELECT * FROM radialesQR WHERE codigo = ?',
      [inputID],
      (_, {rows}) => {
        if (rows.length > 0) {
          console.log('econtrado');
          const registro = rows.item(0);
          navigation.navigate('ScanData', {scannedDataID: registro});
        } else {
          console.log('NO econtrado');
          // Si no se encuentra el registro, navega a ScanData con un indicador de que no se encontró
          navigation.navigate('ScanData', {
            scannedDataID: {id: 'No encontrado'},
          });
        }
      },
    );
  });
}

export const contar = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT COUNT(*) AS count FROM radialesQR',
      [],

      (_, result) => {
        const rowCount = result.rows.item(0).count;
        console.log(
          'Cantidad de uuuuuuuuu dato  ccccs insertados en la tabla radialesQR:',
          rowCount,
        );
      },
      (_, error) => {
        console.error('Error al realizar la consulta:', error);
      },
    );
  });
};
export const contarsubestaciones = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT COUNT(*) AS count FROM subestaciones',
      [],

      (_, result) => {
        const rowCount = result.rows.item(0).count;
        console.log(
          'Cantidad de uuuuuuuuu dato  ccccs insertados en subestaciones:',
          rowCount,
        );
      },
      (_, error) => {
        console.error('Error al realizar la consulta subestaciones:', error);
      },
    );
  });
};

export const eliminarDatos = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM radialesQR',
      [],
      (_, result) => {
        console.log('Datos eliminados correctamente de la tabla radialesQR');
      },
      (_, error) => {
        console.error('Error al eliminar datos de la tabla radialesQR:', error);
      },
    );
  });
};

export const eliminarDatosSubestaciones = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM subestaciones',
      [],
      (_, result) => {
        console.log('Datos eliminados correctamente de la tabla subestaciones');
      },
      (_, error) => {
        console.error('Error al eliminar datos de la tabla subestaciones:', error);
      },
    );
  });
};


export const botonsubestaciones = async (generatedToken) => {
  try {
    // const data = await fetchSubestacionesDataSync(generatedToken);
    const data = await  eliminarDatosSubestaciones();
    // Aquí puedes realizar cualquier acción adicional con los datos obtenidos, como eliminarlos de la base de datos local
    console.log('Datos de subestaciones obtenidos correctamente:', data);
    return data; 
  } catch (error) {
    console.error('Error al obtener datos de subestaciones:', error);
    throw error;
  }
};



////////////////////////subestaciones 

// export function searchSubestaciones(query) {
//   let searchTerm = query.trim();
//   let sqlQuery;
//   let sqlParams = [];

//   // Verificar si el término de búsqueda tiene al menos 3 caracteres
//   if (searchTerm.length < 3) {
//     console.log('El término de búsqueda debe tener al menos 3 caracteres.');
//     return Promise.resolve([]);
//   } else {
//     // Caso 4: Palabra que comienza con la cadena proporcionada
//     sqlQuery = `SELECT
//                   distrito,
//                   direccion,
//                   amt,
//                   sed,
//                   id
//                 FROM subestaciones
//                 WHERE
//                 (
//                   UPPER(distrito) LIKE UPPER(? || '%') OR
//                   UPPER(direccion) LIKE UPPER(? || '%') OR
//                   UPPER(amt) LIKE UPPER(? || '%') OR
//                   UPPER(sed) LIKE UPPER(? || '%') OR
//                   UPPER(id) LIKE UPPER(? || '%')
//                 )`;
//     sqlParams = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
//   }

//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         sqlQuery,
//         sqlParams,
//         (_, { rows }) => {
//           const results = [];
//           for (let i = 0; i < rows.length; i++) {
//             results.push(rows.item(i));
//           }
//           resolve(results);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// }
let globalSearchTermSubestaciones = ""; // Variable global para almacenar el término de búsqueda de subestaciones
let wordCountSubestaciones = 0; // Variable para contar el número de palabras encontradas en Subestaciones

export function searchSubestaciones(query) {
  if (query) {
    // Actualizar globalSearchTermSubestaciones solo si la consulta no es nula o vacía
    globalSearchTermSubestaciones = query.trim().toUpperCase(); // Convertir la consulta a mayúsculas
  }

  let sqlQuery = `SELECT
                    distrito,
                    direccion,
                    amt,
                    sed,
                    id
                  FROM subestaciones
                  WHERE
                  (
                    UPPER(distrito) LIKE ? OR
                    UPPER(direccion) LIKE ? OR
                    UPPER(amt) LIKE ? OR
                    UPPER(sed) LIKE ? OR
                    UPPER(id) LIKE ?
                  )`;
  let sqlParams = Array(5).fill(`%${globalSearchTermSubestaciones}%`); // Array con 5 elementos iguales

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sqlQuery,
        sqlParams,
        (_, { rows }) => {
          const results = [];
          wordCountSubestaciones = rows.length; // Actualizar el conteo de palabras encontradas
          for (let i = 0; i < wordCountSubestaciones; i++) {
            results.push(rows.item(i));
          }
          resolve(results);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

// Función para obtener el conteo de palabras encontradas en Subestaciones
export function getWordCountSubestaciones() {
  return wordCountSubestaciones;
}



export function searchSubestacionById(id) {
  let sqlQuery = `SELECT
                    subestaciones.provincia,
                    subestaciones.distrito,
                    subestaciones.direccion,
                    subestaciones.u_negocio,
                    subestaciones.amt,
                    subestaciones.sed,
                    subestaciones.fecha_instalacion, 
                    subestaciones.tipo,
                    subestaciones.propietario,
                    subestaciones.coordenadas,
                    subestaciones.transformador
                  FROM subestaciones
                  WHERE subestaciones.id = ?`;
  let sqlParams = [id];

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sqlQuery,
        sqlParams,
        (_, { rows }) => {
          const results = [];
          for (let i = 0; i < rows.length; i++) {
            results.push(rows.item(i)); // Cambia esto a results.push(rows._array[i]);
          }
          console.log('Resultados de los detaller:', results);
          resolve(results);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}


///////////////////////radiales+

// **Inicializar searchTerm con un valor vacío fuera de la función**
// let searchTerm = "";

// export function searchRadialesQR(query) {
//   if (query) {
//     // **Actualizar searchTerm solo si la consulta no es nula o vacía**
//     searchTerm = query.trim().toUpperCase(); // Convertir la consulta a mayúsculas
//   }

//   let sqlQuery = `SELECT
//     id,
//     codigo,
//     se,
//     amt,
//     marca,
//     modelo_de_rele,
//     nombre_de_radial,
//     nivel_de_tension_kv
//   FROM radialesQR
//   WHERE
//   (
//     UPPER(codigo) LIKE ? OR
//     UPPER(se) LIKE ? OR
//     UPPER(amt) LIKE ? OR
//     UPPER(marca) LIKE ? OR
//     UPPER(modelo_de_rele) LIKE ? OR
//     UPPER(nombre_de_radial) LIKE ?
//   )`;

//   let sqlParams = Array(6).fill(`%${searchTerm}%`); // Array con 6 elementos iguales

//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         sqlQuery,
//         sqlParams,
//         (_, { rows }) => {
//           const results = [];
//           for (let i = 0; i < rows.length; i++) {
//             results.push(rows.item(i));
//           }
//           resolve(results);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// }
let searchTerm = "";
let wordCount = 0; // Variable para contar el número de palabras encontradas

export function searchRadialesQR(query) {
  if (query) {
    // Actualizar searchTerm solo si la consulta no es nula o vacía
    searchTerm = query.trim().toUpperCase(); // Convertir la consulta a mayúsculas
  }

  let sqlQuery = `SELECT
    id,
    codigo,
    se,
    amt,
    marca,
    modelo_de_rele,
    nombre_de_radial,
    nivel_de_tension_kv
  FROM radialesQR
  WHERE
  (
    UPPER(codigo) LIKE ? OR
    UPPER(se) LIKE ? OR
    UPPER(amt) LIKE ? OR
    UPPER(marca) LIKE ? OR
    UPPER(modelo_de_rele) LIKE ? OR
    UPPER(nombre_de_radial) LIKE ?
  )`;

  let sqlParams = Array(6).fill(`%${searchTerm}%`); // Array con 6 elementos iguales

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sqlQuery,
        sqlParams,
        (_, { rows }) => {
          const results = [];
          wordCount = rows.length; // Actualizar el conteo de palabras encontradas
          for (let i = 0; i < wordCount; i++) {
            results.push(rows.item(i));
          }
          resolve(results);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

// Función para obtener el conteo de palabras encontradas
export function getWordCountRadiales() {
  return wordCount;
}


export function searchRadialById(id) {
  let sqlQuery = `SELECT
                    radialesQR.codigo,
                    radialesQR.se,
                    radialesQR.amt,
                    radialesQR.marca,
                    radialesQR.modelo_de_rele,
                    radialesQR.nombre_de_radial,
                    radialesQR.nivel_de_tension_kv,
                    radialesQR.tipo,
                    radialesQR.propietario,
                    radialesQR.latitud,
                    radialesQR.longitud,
                    radialesQR.fec_instala,
                    radialesQR.estado,
                    radialesQR.fec_camb_bateria
                  FROM radialesQR
                  WHERE radialesQR.id = ?`;
  let sqlParams = [id];

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sqlQuery,
        sqlParams,
        (_, { rows }) => {
          const results = [];
          for (let i = 0; i < rows.length; i++) {
            results.push(rows.item(i)); // No es necesario cambiar esta línea
          }
          console.log('Resultados del detalle del radial:', results);
          resolve(results);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
