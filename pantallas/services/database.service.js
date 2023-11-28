// import * as SQLite from "expo-sqlite";
import SQLite from 'react-native-sqlite-storage';

import axios from "axios";
const db = SQLite.openDatabase("dbradiales.db");


export const initializeDatabase = () =>{
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS radialesQR (" +
          "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          "codigo TEXT, " +
          "se TEXT, " +
          "amt TEXT, " +
          "marca TEXT, " +
          "modelo_de_rele TEXT, " +
          "nombre_de_radial TEXT, " +
          "nivel_de_tension_kv REAL, " +
          "tipo TEXT, " +
          "propietario TEXT, " +
          "latitud REAL, " +
          "longitud REAL, " +
          "fec_instala TEXT, " +
          "estado TEXT, " +
          "fec_camb_bateria TEXT, " +
          "creado_en TEXT DEFAULT CURRENT_TIMESTAMP, " +
          "actualizado_en TEXT DEFAULT CURRENT_TIMESTAMP)"
      );
      
        db.transaction((tx) => {
          // tx.executeSql(
          //   'DROP TABLE parametrosqr'
          // );
          // tx.executeSql(
          //   'DROP TABLE radialesQR'
          // );
  
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS parametrosqr (" +
              "NOMBRE TEXT," +
              "VALOR TEXT" +
              ")"
          );
  
          tx.executeSql(
            "SELECT * FROM parametrosqr WHERE nombre=?",
            ["ULT_ACT"],
            (_, { rows }) => {
              // console.log("las consultas de select de la fecha", rows);
              if (rows.length > 0) {
                tx.executeSql(
                  "INSERT INTO parametrosqr (NOMBRE, VALOR) VALUES (?, ?)",
                  ["ULT_ACT", ""],
                  (_, result) => {
                    console.log(
                      "Registro insertado con éxito en la tabla parametrosqr"
                    );
                  },
                  (_, error) => {
                    console.error(
                      "Error al insertar el registro en la tabla parametrosqr:",
                      error
                    );
                  }
                );
              }
            },
            (_, error) => {
              console.error("error", error);
            }
          );
        });
  
        tx.executeSql(
          "SELECT * FROM parametrosqr",
          [],
          (_, result) => {
            console.log("los datos de la consulta", result);
            const rows = result.rows;
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              // console.log("Fila", i + 1, ":", item);
              // console.log("NOMBRE:", item.NOMBRE, "VALOR:", item.VALOR);
            }
          },
          (_, error) => {
            console.error(
              "Error al obtener los datos de la tabla parametrosqr:",
              error
            );
          }
        );
        contar(); 

  
      });

}


export function getParametroFecha(){
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
    
      tx.executeSql(
        "SELECT * FROM parametrosqr WHERE nombre=?",
        ["ULT_ACT"],
        (_, { rows }) => {
          // console.log("las consultas de select de la fecha", rows);
          const registro = rows.item(0);

          resolve(registro);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

export function getRadialById(inputID){
  console.log('el imput',inputID)
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM radialesQR where codigo=?",
        [inputID],
        (_, { rows }) => {
          if (rows.length > 0) {
            const registro = rows.item(0);

            resolve(registro);
          } else {
            resolve({ id: "No encontrado" });
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}


export const handleDelete = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM radialesQR",
      
      
      
      [],
      (_, result) => {
        console.log("Datos eliminados con éxito de la tabla radialesQR.");
      },
      (_, error) => {
        console.error(
          "Error al eliminar los datos de la tabla radialesQR:",
          error
        );
      }
    );
  });

  contar();

};
//////////////////////////////////////////////////apisssssssssssssssss

export const fetchToken = () => {
  const apiUrl = "http://10.112.47.55:5000/qr/token";
  const apiKey = "mama"; // Código a enviar en el cuerpo de la solicitud

  return new Promise((resolve, reject) => {
    axios
      .post(apiUrl, { idapp: apiKey })
      .then((response) => {
        const generatedToken = response.data.token;
        resolve(generatedToken);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const fetchDataSync = (generatedToken, fecha_busqueda) => {
  return new Promise((resolve, reject) => {
    const otherApiUrl = `http://10.112.47.55:5000/qr/radialesqr?fecha_busqueda=${fecha_busqueda}`;
    axios
      .get(otherApiUrl, {
        headers: {
          Authorization: `Bearer ${generatedToken}`,
        },
      })

      .then((otherApiResponse) => {
        const dataFromAPI = otherApiResponse.data;
        // console.log('LOS DATOS DE LA APIS:', dataFromAPI.radiales)
        resolve(otherApiResponse.data);
      })
      .catch((error) => {
        reject(error);
        
      });
  });
};
/////////////////////////////////////fecha 

const actualizarFechaEnParametrosQR = (fecha) => {
  return new Promise((resolve, reject) => {
    console.log("Fecha a actualizar:", fecha);
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE parametrosqr SET VALOR=? WHERE NOMBRE=?",
        [fecha, "ULT_ACT"],
        (_, result) => {
          console.log("Resultado de la actualización:", result);
          console.log(
            "Fecha actualizada con éxito en la tabla parametrosqr:",
            fecha
          );
          resolve("Éxito al actualizar la fecha");
        },
        (_, error) => {
          console.error(
            "Error al actualizar la fecha en la tabla parametrosqr:",
            error
          );
          reject("Error al actualizar la fecha");
        }
      );
    });
  });
};
///////////////////////////////insertarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
export const insertRadiales = (data) => {
  return new Promise((resolve, reject) => {
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    const insertPromises = batches.map((batch) => {
      return new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            batch.forEach((item) => {
              tx.executeSql(
                "INSERT INTO radialesQR (codigo, se, amt, marca, modelo_de_rele, nombre_de_radial, nivel_de_tension_kv, tipo, propietario, latitud, longitud, fec_instala, estado, fec_camb_bateria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
                (_, result) => {}
              );
            });
          },
          (txError) => {
            reject(txError);
          },
          () => {
            resolve(true);
          }
        );
      });
    });

    Promise.all(insertPromises)
      .then(() => {
        resolve("Inserción de datos completa");
      })
      .catch((error) => {
        reject(`Error al insertar datos: ${error}`);
      });
  });
};

///////////////////////////////////7actualizas7///////////////////////
export const updateRadiales = (data) => {
  return new Promise((resolve, reject) => {
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    const updatePromises = batches.map((batch) => {
      return new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            batch.forEach((item) => {
              tx.executeSql(
                "UPDATE radialesQR SET codigo = ?, se = ?, amt = ?, marca = ?, modelo_de_rele = ?, nombre_de_radial = ?, nivel_de_tension_kv = ?, tipo = ?, propietario = ?, latitud = ?, longitud = ?, fec_instala = ?, estado = ?, fec_camb_bateria = ? WHERE id = ?",
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
                (txError) => {
                  reject(txError);
                }
              );
            });
          },
          (txError) => {
            reject(txError);
          },
          () => {
            resolve();
          }
        );
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        resolve("Actualización de datos completa");
      })
      .catch((error) => {
        reject(`Error al actualizar datos: ${error}`);
      });
  });
};


//////////////////////////////////////////mainnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
export const handleSync = async () => {
  try {
    //  let exito_insertar = await insertBatchIntoDB(data);
    let fecha_busqueda = await getParametroFecha(); 
    // let fecha_busqueda = '2023-11-13 17:20:00';

    // let fecha_busqueda = "";
    // // const fecha_busqueda = null;
    console.log("la fecha actualizada busqueda", fecha_busqueda);
    let generatedToken = await fetchToken();
    // console.log('vhbjnkl',generatedToken)
    let data = await fetchDataSync(generatedToken, fecha_busqueda);
    // // console.log('todos mm los datos data.radiales',data.radiales)
    if (data) {
      console.log("paso 1");
      if (fecha_busqueda === "") {
        console.log("paso 2");
        if (data.radiales) {
          console.log("paso 3");
          let exito_insertar = await insertRadiales(data.radiales);
          console.log("los datos mm de boton en insertado", exito_insertar);
        }
      } else {
        if (data) {
          console.log("paso 4");
          if (data.radiales) {
            console.log("paso 5");
            let dataInsertar = data.radiales.filter(
              (item) => (item.accion = "insertar")
            );

            console.log("paso 6");
            let dataActualizar = data.radiales.filter(
              (item) => (item.accion = "actualizar")
            );

            console.log("paso 7");
            if (dataInsertar) {
              let exito_insertar = await insertRadiales(dataInsertar);

              // console.log('datos isertados por la fecha',exito_insertar)
            }

            console.log("paso 8");
            if (dataActualizar) {
              let exito_actualizar = await updateRadiales(dataActualizar);
              console.log("paso 9");
              console.log("datos autilizado por la fecha", exito_actualizar);
            }
          }
        }
      }
    }

    let fecha = data.fecha;

    console.log("la fechas de la api", fecha);
    if (fecha) {
      let la_fecha_actualida = await actualizarFechaEnParametrosQR(fecha);
      console.log("la fecha fue actualiz a", la_fecha_actualida);
    }
  } catch (ex) {
    console.error(ex);
  }
  // const fecha_busqueda = '2023-10-24 8:30:00';
};

//bonessssssssssssssssssssssssssss

export function handleSearchButton() {
  console.log('entro')
  db.transaction(tx => {
    // Suponiendo que 'inputID' contiene el ID ingresado por el usuario
    tx.executeSql("SELECT * FROM radialesQR WHERE codigo = ?", [inputID], (_, { rows }) => {
      if (rows.length > 0) {
        console.log('econtrado')
        const registro = rows.item(0);
        navigation.navigate("ScanData", { scannedDataID: registro });
      } else {
        console.log('NO econtrado')
        // Si no se encuentra el registro, navega a ScanData con un indicador de que no se encontró
        navigation.navigate("ScanData", { scannedDataID: { id: "No encontrado" } });
      }
    });
  });
}

export const contar = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT COUNT(*) AS count FROM radialesQR",
      [],
      
      (_, result) => {
        const rowCount = result.rows.item(0).count;
        console.log(
          "Cantidad de uuuuuuuuu datos insertados en la tabla radialesQR:",
          rowCount
        );
      },
      (_, error) => {
        console.error("Error al realizar la consulta:", error);
      }
    );
  });
};
