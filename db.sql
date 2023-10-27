CREATE TABLE radiales (
    Id INTEGER,
    Estado TEXT,
    Tipo_de_red TEXT,
    T_Nominal TEXT,
    Nombre TEXT,
    Alias TEXT,
    Tipo_de_propietario TEXT,
    Nombre_del_propietario TEXT,
    Estilo_de_subcodigo TEXT,
    Montaje TEXT,
    Swit_Installation_Date TEXT,
    Descripcion_Optimus TEXT,
    UTMEste TEXT,
    UTMNorte TEXT,
    ID_de_circuito_ConcatSet TEXT,
    Alias_ConcatSet TEXT,
    Latitud REAL,
    Longitud REAL,
    Unionn TEXT
);







INSERT INTO radiales (
    Id,
    Estado,
    Tipo_de_red,
    T_Nominal,
    Nombre,
    Alias,
    Tipo_de_propietario,
    Nombre_del_propietario,
    Estilo_de_subcodigo,
    Montaje,
    Swit_Installation_Date,
    Descripcion_Optimus,
    UTMEste,
    UTMNorte,
    ID_de_circuito_ConcatSet,
    Alias_ConcatSet,
    Latitud,
    Longitud,
    Unionn
) VALUES
    (4208763, 'Existente', 'MT', '22.9 KV', 'I200977', 'A2023-I200', 'Municipalidad', 'MUNICIPALIDAD DISTRITAL DE PIMENTEL', 'Cut Out', 'Aéreo', '24/10/2016 00:00', 'FUNDO LAS PAMPAS SAN GREGORIO', '617690.853', '9245456.321', 'A2023', 'C-224', -6.825093894, -79.93490386, '-6.8250938939381,-79.9349038631954'),
    (4208767, 'Existente', 'MT', '10 KV', 'I200978', 'A2053-I200', 'Distribuidora', 'Electronorte', 'Cut Out', 'Aéreo', '7/11/2016 00:00', 'LA HUACA EL IMPERIA', '639278.565', '9338417.654', 'A2053', 'OLM101', -5.983882322, -79.74162679, '-5.98388232200952,-79.7416267861407'),
    (4208772, 'Existente', 'MT', '22.9 KV', 'I200979', 'A2052-I200', 'Distribuidora', 'Electronorte', 'Recloser', 'Aéreo', '23/11/2016 00:00', 'CULPON', '677178.45', '9238984.346', 'A2052', 'CAY201', -6.88212755, -79.39646796, '-6.8821275497883,-79.3964679640679'),
    (4208777, 'Existente', 'MT', '22.9 KV', 'I200962', 'A2054-I200', 'Distribuidora', 'Electronorte', 'Cut Out', 'Aéreo', '6/09/2016 00:00', 'PEDREROS', '637905.11', '9341005.297', 'A2054', 'OLM201', -5.960507525, -79.75408676, '-5.96050752490648,-79.7540867627053'),
    (4208782, 'Existente', 'MT', '22.9 KV', 'I200966', 'A2046-I200', 'Distribuidora', 'Electronorte', 'Cut Out', 'Aéreo', '13/09/2016 00:00', 'PORCUYA', '664815.108', '9354075.787', 'A2046', 'OCC201', -5.841704194, -79.51133308, '-5.84170419362093,-79.5113330785801'),
    (4208786, 'Existente', 'MT', '10 KV', 'I200967', 'A2006-I200', 'Distribuidora', 'Electronorte', 'Cut Out', 'Aéreo', '26/09/2016 00:00', 'ROSALES-SANTO TOMAS', '627245.703', '9247883.401', 'A2006', 'C-217', -6.802944228, -79.84849678, '-6.80294422768223,-79.8484967766892'),
    (4208791, 'Existente', 'MT', '22.9 KV', 'I200968', 'A2056-I200', 'Distribuidora', 'Electronorte', 'Cut Out', 'Aéreo', '30/09/2016 00:00', 'LUCMILLA', '716109.43', '9262513.677', 'A2056', 'CAR202', -6.668094393, -79.04511199, '-6.66809439291406,-79.0451119941652'),
    (4208794, 'Existente', 'MT', '22.9 KV', 'I200969', 'A2083-I200', 'Distribuidora', 'Electronorte', 'Recloser', 'Aéreo', '7/10/2016 00:00', 'SERQUERA', '644215.006', '9320781.639', 'A2083', 'NMOT202', -6.143277421, -79.69665116, '-6.14327742143026,-79.6966511647752'),
    (4208799, 'Existente', 'MT', '10 KV', 'I200970', 'A2065-I200', 'Distribuidora', 'Electronorte', 'Recloser', 'Aéreo', '7/10/2016 00:00', 'LA SARANDA', '636512.527', '9294731.441', 'A2065', 'LAV102', -6.37904365, -79.76569822, '-6.37904365008319,-79.7656982199307'),
    (4208804, 'Existente', 'MT', '22.9 KV', 'I200971', 'A2054-I200', 'Distribuidora', 'Electronorte', 'Recloser', 'Aéreo', '7/10/2016 00:00', 'PUNTA TUNAPE', '637624.232', '9336861.917', 'A2054', 'OLM201', -5.997986746, -79.75653934, '-5.99798674622686,-79.7565393420095');
