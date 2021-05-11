const senate = document.querySelector("#senate")
const house = document.querySelector("#house")

if (senate) {
  fetchearData("senate")
  console.log("estamos en senante")
} else {
  fetchearData("house")

}

async function fetchearData(url) {
  
  try {
    const respuesta = await fetch('https://api.propublica.org/congress/v1/113/' + url +'/members.json', {
      method: 'GET',
      headers: {
        'X-API-Key': 'wZ1YhJiyHS09S2ztB4gooEnE12HHVhAyi9Tn0Mvl'
      }
    })
      
  var data = await respuesta.json()
  
    myProgram(data)
    
  } catch (error) { }
}




function myProgram(data) {

  let btn = document.querySelector("#btn")
  let text = document.querySelector("#textoParaMostrar")
  function ocultarMostrarTexto() {

    btn.addEventListener("click", () => {
  
      if (text.className === "bloque_text") {
        text.className = "bloque_text_btn"
        btn.innerText = "Show Less"
      } else {
        text.className = "bloque_text"
        btn.innerText = "Read More"
      }


    })
  }

  if (btn) {
    ocultarMostrarTexto()
  }

  /* Tabla */
  const tableSenate = document.querySelector("#data_senate");

  /* Formulario */
  const formState = document.querySelector("#select_state");

  /* Senadores */
  const members1 = data.results[0].members; // Accediento al objecto member con sus propiedades

  /* Enviar datos */
  const form = document.querySelector("#sendData");

  function informacionToda() {
    tableSenate.innerHTML = "";
    members1.forEach((persona) => {
      tableSenate.innerHTML += `
     <tr>
     <td> <a href= ${persona.url}>   ${persona.last_name} ${persona.first_name
        } ${persona.middle_name || " "}   </a></td>
     <td> ${persona.party}</td>
     <td > ${persona.state}</td>
     <td > ${persona.seniority}</td>
     <td  > ${persona.votes_with_party_pct.toFixed(2)} %</td>
     </tr> `;
    });
  }

  if (tableSenate) {
    informacionToda();
  }
  /* Select (options) */

  function filterState() {
    let state = [];

    members1.map((simple) => {
      if (state.indexOf(simple.state) === -1) {
        state.push(simple.state);
      }
    });

    state.forEach((state) => {
      formState.innerHTML += `<option value="${state}">${state}</option>`;
    });
  }

  if (tableSenate) {
    filterState();
  }

  function getSelectCheckboxValues() {
    const selectValue = document.getElementById("select_state").value;

    let checkboxs = document.querySelectorAll('input[name="party"]:checked');
    let array = Array.from(checkboxs);

    if (array.length != 0) {
      /* Esto es para que no se me acumulen cada vez que precio. Si este  lo tengo en el forEach cada vez que pase un ID lo va a limpiar por ende nunca se acumularian */
      tableSenate.innerHTML = "";
      for (let i = 0; i < array.length; i++) {
        const selectParty = array[i].id;

        const selectFilter = members1.filter((partido) => {
          return selectParty === partido.party;
        });

        if (selectValue === "stateView") {
          selectFilter.forEach((persona) => {
            tableSenate.innerHTML += `
     <tr>
     <td> <a href= ${persona.url}> ${persona.last_name} ${persona.first_name} ${persona.middle_name || " "
              }   </a></td>
     <td> ${persona.party}</td>
     <td> ${persona.state}</td>
     <td> ${persona.seniority}</td>
     <td > ${persona.votes_with_party_pct} %</td>
     </tr> `;
          });
        }

        const stateFilter = selectFilter.filter((person) => { return selectValue === person.state; });

        stateFilter.forEach((persona) => {
          tableSenate.innerHTML += `
     <tr>
     <td> <a href= ${persona.url}> ${persona.last_name} ${persona.first_name} ${persona.middle_name || " "
            }   </a></td>
     <td> ${persona.party}</td>
     <td> ${persona.state}</td>
     <td> ${persona.seniority}</td>
     <td > ${persona.votes_with_party_pct} %</td>
     </tr> `;
        });
      }
    } else {
      const stateFilter = members1.filter((states) => {
        return selectValue === states.state;
      });

      if (selectValue === "stateView") {
        informacionToda();
      } else {
        tableSenate.innerHTML = "";
        stateFilter.forEach((persona) => {
          tableSenate.innerHTML += `
     <tr>
     <td> <a href= ${persona.url}>   ${persona.last_name} ${persona.first_name
            } ${persona.middle_name || " "}   </a></td>
     <td> ${persona.party}</td>
     <td > ${persona.state}</td>
     <td > ${persona.seniority}</td>
     <td  > ${persona.votes_with_party_pct} %</td>
     </tr> `;
        });
      }
    }
  }

  if (tableSenate) {
    getSelectCheckboxValues();
  }

  /* Arranca la parte  de Attendance Senate */

  const statistics = {
    totalDemocratas: 0,
    totalRepublicanos: 0,
    totalIndependientes: 0,
    totalPartidos: 0,
    promedioVotosDemocratas: 0,
    promedioVotosDemocratas: 0,
    promedioVotosIndependientes: 0,
    promedioPartidos: 0,
    menosVotosperdidos: [],
    masVotosperdidos: [],
    menosCompromeditos: [],
    masCompromeditos: [],
  };
  /* Suma de cada partido  */

  members1.map((member) => {
    if (member.party === "D") {
      statistics.totalDemocratas++;
    }
    if (member.party === "R") {
      statistics.totalRepublicanos++;
    }
    if (member.party === "ID") {
      statistics.totalIndependientes++;
    }

    statistics.totalPartidos = statistics.totalDemocratas + statistics.totalRepublicanos + statistics.totalIndependientes;
  });

  /* Saco el promedio de los partidos  */

  function obtenerPromediosDePartidos(partido, miembrosDelPartido) {
  
    if (miembrosDelPartido > 1) {
      let votosTotal = [0];

      members1.forEach((miembro) => {
        if (miembro.party === partido) {
          votosTotal.push(miembro.votes_with_party_pct);
        }
        return votosTotal;
      });

      suma = votosTotal.reduce((a, b) => a + b) / miembrosDelPartido;

      return suma.toFixed(2);
  
    } else {
      return suma = "0.00"
    }
  

  }
  statistics.promedioVotosDemocratas = obtenerPromediosDePartidos("D", statistics.totalDemocratas);
  statistics.promedioVotosDemocratas = obtenerPromediosDePartidos("R", statistics.totalRepublicanos);
  statistics.promedioVotosIndependientes = obtenerPromediosDePartidos("ID", statistics.totalIndependientes);

  /* Obtener promedio total */

  let votosPorcentajes = [0];

  members1.forEach((miembro) => {
    votosPorcentajes.push(miembro.votes_with_party_pct);
  });

  statistics.promedioPartidos = (votosPorcentajes.reduce((a, b) => a + b) / members1.length).toFixed(2);

  /* Porcentaje  */

  let totalDeMiembros = [...members1]

  statistics.totalMiembros = totalDeMiembros

  function obtenerMiembrosOrdenados(table, propiedad) {
  
    if (table === "menorAmayor") {
   
      let miembrosOrdenados = statistics.totalMiembros.sort((a, b) => a[propiedad] - b[propiedad]);
  
      let votosFiltrados = miembrosOrdenados.filter((menosVotos) => {
        return menosVotos.total_votes >= 1;
      });
       
      let miembrosPorcentaje = Math.ceil(votosFiltrados.length * 10 / 100)

      let miembros = [];

      for (let i = 0; i < miembrosPorcentaje; i++) {
        miembros.push(votosFiltrados[i]);
      }
   
      return miembros

    } else {
      let votosOrdenados = members1.sort((a, b) => b[propiedad] - a[propiedad]);
   
      let miembrosPorcentaje = Math.ceil(votosOrdenados.length * 10 / 100)

      let miembros = [];

      for (let i = 0; i < miembrosPorcentaje; i++) {
        miembros.push(votosOrdenados[i]);
      }
   
      return miembros
    }
  
  }

  statistics.masVotosperdidos = obtenerMiembrosOrdenados("mayorAmenor", "missed_votes_pct",)
  statistics.menosVotosperdidos = obtenerMiembrosOrdenados("menorAmayor", "missed_votes_pct",)

  statistics.menosCompromeditos = obtenerMiembrosOrdenados("menorAmayor", "votes_with_party_pct")
  statistics.masCompromeditos = obtenerMiembrosOrdenados("mayorAmenor", "votes_with_party_pct");

  /* Imprimiendo los datos */
  const tablaMiembros = document.querySelector("#tableMembers");

  function imprimirTablaPartidos() {
    tablaMiembros.innerHTML = `
    <tr>
     <td>Democrats</td>
     <td> ${statistics.totalDemocratas} </td>
      <td> ${statistics.promedioVotosDemocratas} % </td>
    </tr>
     <tr>
     <td>Republicans</td>
     <td> ${statistics.totalRepublicanos} </td>
       <td> ${statistics.promedioVotosDemocratas} %</td>
    </tr>
     <tr>
     <td>Independent</td>
     <td> ${statistics.totalIndependientes} </td>
     <td> ${statistics.promedioVotosIndependientes} % </td>
    </tr>
      <tr>
     <td>Total</td>
     <td> ${statistics.totalPartidos} </td>
       <td> ${statistics.promedioPartidos} % </td>
    </tr>
    `;
  }

  //Atendance
  const tableMasVotosPerdidos = document.querySelector("#tableMasVotosPerdidos")
  const tableMenosVotos = document.querySelector("#tableAttendance");

  //Loyalty
  const tableMasComprometidos = document.querySelector("#tableMas");
  const tableMenosComprometidos = document.querySelector("#tableMenos");

  function imprimirTablePartidos(miembros, table) {
      
    if (table === tableMenosVotos || table === tableMasVotosPerdidos) {
      miembros.forEach((member) => {
        table.innerHTML += `
        <tr>
      <td> <a href="${member.url}"  target="_blank"> ${member.last_name} ,${member.first_name} </a> </td>
      <td>${member.missed_votes}</td>
      <td>${member.missed_votes_pct} %</td>
      </tr>
    `;
      });
    } else {
      miembros.forEach((member) => {
        table.innerHTML += `
    
    <tr>
    <td> <a href="${member.url}" target="_blank" >${member.last_name},${member.first_name} </a> </td>
    <td>${(member.total_votes * member.votes_with_party_pct / 100).toFixed(0)}</td>
    <td>${member.votes_with_party_pct} %</td>
    </tr>
    `;
      });

    }
    
  }

  if (tableMenosVotos) {
    imprimirTablePartidos(statistics.menosVotosperdidos, tableMenosVotos,)
  }

  if (tableMasVotosPerdidos) {
    imprimirTablePartidos(statistics.masVotosperdidos, tableMasVotosPerdidos)
  }

  if (tableMasComprometidos) {
    imprimirTablePartidos(statistics.masCompromeditos, tableMasComprometidos)
  }

  if (tableMenosComprometidos) {
   
    imprimirTablePartidos(statistics.menosCompromeditos, tableMenosComprometidos)

  }
  if (tablaMiembros) {
    imprimirTablaPartidos()
  }

}