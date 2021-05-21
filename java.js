window.onload = event =>{
    var poop = document.getElementById('item_no1');
    var poop2 = document.getElementById('item_type1');

    poop.addEventListener('change', event => {
        var table = document.getElementById("Table");
        const el = table.rows[poop.parentNode.parentNode.rowIndex];
        const el2 = table.rows[parseInt(poop.value)];

        if(poop.value > poop.parentNode.parentNode.rowIndex){
            el2.parentNode.insertBefore(el, el2.nextSibling);
        }

        if(poop.value < poop.parentNode.parentNode.rowIndex){
            el2.parentNode.insertBefore(el, el2);
        }

        for (i = 1; i < table.rows.length; i++)
        {
            table.rows[i].cells[0].childNodes[0].value = i;
            console.log(table.rows.length,"waaaaher");
        }
    });

    poop2.addEventListener('change', event => {
        if (poop2.value == 'Pipe'){
            document.getElementById('K_factor1').setAttribute('readonly',true);
            document.getElementById('pipe_length1').removeAttribute('readonly');
            document.getElementById('K_factor1').className = "NAfield";
            document.getElementById('pipe_length1').className = "inputs";
            document.getElementById('K_factor1').value = '';
        } else {
            document.getElementById('K_factor1').removeAttribute('readonly');
            document.getElementById('pipe_length1').setAttribute('readonly',true);
            document.getElementById('K_factor1').className = "inputs";
            document.getElementById('pipe_length1').className = "NAfield";
            document.getElementById('pipe_length1').value = '';
        }
    });

}

function AddRow(){
    var table = document.getElementById("Table");
    var NoRows = document.getElementById("Table").rows.length;
    var row = table.insertRow(NoRows);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    cell1.innerHTML = "<input class='item_no_input' type='number' id='item_no" + NoRows + "' name='item_no" + NoRows + "' value=" + NoRows + "></input>";
    cell2.innerHTML = "<select name='item_type" + NoRows + "' id='item_type" + NoRows + "'><option value='Pipe'>Pipe</option><option value='Ball Valve'>Ball Valve</option><option value='Globe Valve'>Globe Valve</option><option value='Bend'>Bend</option><option value='Tee'>Tee</option></select>";
    cell3.innerHTML = "<input class='inputs' type='number' id='diameter" + NoRows + "' name='diameter" + NoRows + "' value=0.025><div class = 'UnitContainer'><label for='x_int'>m3</label></div>";
    cell4.innerHTML = "<input class='inputs' type='number' id='pipe_length" + NoRows + "' name='pipe_length" + NoRows + "' value=1><div class = 'UnitContainer'><label for='x_int'>m3</label></div>";
    cell5.innerHTML = "<input class='NAfield' type='number' id='K_factor" + NoRows + "' name='K_factor" + NoRows + "' readonly></th>";
    cell6.innerHTML = "<input class='inputs' type='number' id='pdrop" + NoRows + "' name='pdrop" + NoRows + "' value=25><div class = 'UnitContainer'><label for='x_int'>m3</label></div>";
    cell7.innerHTML = "<input class='outputs' type='number' id='pdrop_total" + NoRows + "' name='pdrop_total" + NoRows + "' readonly></input><div class = 'UnitContainer'><label for='x_int'>m3</label></div>";

    var poop = document.getElementById('item_no'+ NoRows);
    var poop2 = document.getElementById('item_type'+ NoRows);
    console.log(poop2.value,"waaaa");

    poop.addEventListener('change', event => {
        const el = table.rows[poop.parentNode.parentNode.rowIndex];
        const el2 = table.rows[parseInt(poop.value)];
        
        if(poop.value > poop.parentNode.parentNode.rowIndex){
            el2.parentNode.insertBefore(el, el2.nextSibling);
        }

        if(poop.value < poop.parentNode.parentNode.rowIndex){
            el2.parentNode.insertBefore(el, el2);
        }
        for (i = 1; i < table.rows.length; i++)
        {
            table.rows[i].cells[0].childNodes[0].value = i;
            console.log(table.rows.length,"waaaager");
        }
    });

    poop2.addEventListener('change', event => {
        if (poop2.value == 'Pipe'){
            document.getElementById('K_factor' + NoRows).setAttribute('readonly',true);
            document.getElementById('pipe_length' + NoRows).removeAttribute('readonly');
            document.getElementById('K_factor' + NoRows).className = "NAfield";
            document.getElementById('pipe_length' + NoRows).className = "inputs";
            document.getElementById('K_factor' + NoRows).value = '';
        } else {
            document.getElementById('K_factor' + NoRows).removeAttribute('readonly');
            document.getElementById('pipe_length' + NoRows).setAttribute('readonly',true);
            document.getElementById('K_factor' + NoRows).className = "inputs";
            document.getElementById('pipe_length' + NoRows).className = "NAfield";
            document.getElementById('pipe_length' + NoRows).value = '';
        }
    });

}

function calc_delp(){
    var NoRows = document.getElementById("Table").rows.length;
    var Q = document.getElementById('flowrate').value;
    var e = document.getElementById('roughness').value;
    var mu = document.getElementById('viscosity').value;
    var rho = document.getElementById('density').value;

    for (i = 1; i < NoRows; i++){
        var D = document.getElementById('diameter' + i).value;
        var e = document.getElementById('item_type' + i).selectedIndex;
        var type = document.getElementsByTagName("option")[e].text;
        console.log(type, "item_type");
        
        const v = Q_to_v(Q, D);

        if(type == 'Pipe')
        {
            var L = document.getElementById('pipe_length' + i).value;
            const  Re = Reynolds_Number(rho, v, D, mu);
            const f = Colebrook_Approximation(Re, e, D);
            const del_p = DarcyWeisbach_delp(L, f, rho, D, v);
            document.getElementById('pdrop' + i).value = del_p;
        } else {
            var K = document.getElementById('K_factor' + i).value;
            const del_p = DarcyWeisbach_K(K, rho, v);
            document.getElementById('pdrop' + i).value = del_p;
        }
    }

    pdrop_total();
}

function DarcyWeisbach_delp(L, f, rho, D, v){
    var del_p = L*f*(rho/2)*((Math.pow(v,2))/D);
    console.log(del_p, "pdrop");
    return del_p;
}

function DarcyWeisbach_K(K, rho, v){
    var del_p = K*(rho/2)*(Math.pow(v,2));
    console.log(del_p, "pdrop");
    return del_p;
}

function DarcyWeisbach_v(L, f, rho, D, del_p){
    var v = Math.pow((del_p/L)*(2/rho)*(D/f), 0.5);
}

function Q_to_v(Q, D){
    var v = Q/(Math.PI*Math.pow((D/2),2));
    console.log(v, "velocity");
    return v;
}

function v_to_Q(v, D){
    var Q = v/(Math.PI*Math.pow(D/2,2));
}

function Colebrook_Approximation(Re, e, D){
    var A = (Re*e/D)/8.0897;
    var B = Math.log(Re) - 0.779626;
    var x = A + B;
    var C = Math.log(x);

    var f_working = 0.8685972*(B-C+(C/(x-(0.5588*C) + 1.2079)));
    var f = 1/Math.pow(f_working,2);
    console.log(Re, "Re");
    console.log(f_working, "f_working");
    return f;
}

function Reynolds_Number(rho, v, D, mu){
    var Re = (rho*v*D)/mu;
    return Re;
}

function pdrop_total(){
    var NoRows = document.getElementById("Table").rows.length;
    var pdrop_sum = 0;
    for (i = 1; i < NoRows; i++){
        pdrop_sum = pdrop_sum + parseFloat(document.getElementById('pdrop' + i).value);

        console.log(parseFloat(document.getElementById('pdrop' + i).value), "pdrop_sum");
        document.getElementById('pdrop_total' + i).value = pdrop_sum;
    }
}

