drop database ImpresorasBD;

Create Database ImpresorasBD;

use ImpresorasBD;

Create table empresa(

empresaID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
nombre varchar(20)

);


create table area(

areaID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
nombre VARCHAR(40),
empresaID INT NOT NULL,
FOREIGN KEY (empresaID) REFERENCES empresa(empresaID)

);

create table contrato(

contratoID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
nombre VARCHAR(20),
empresaID INT NOT NULL,
FOREIGN KEY (empresaID) REFERENCES empresa(empresaID),

)


create table impresora(

impresoraID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
serie Varchar(50) NOT NULL,
nombre VARCHAR(100),
marca VARCHAR(15),
modelo VARCHAR(30),
direccionIp VARCHAR(15),
areaID INT NOT NULL,
contratoID INT NOT NULL,
FOREIGN KEY (areaID) REFERENCES area(areaID),
FOREIGN KEY (contratoID) REFERENCES contrato(contratoID),
toner VARCHAR(80)

);


create table consumible(

consumibleID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
tipo VARCHAR(20), 
modelo VARCHAR(20), 
tij VARCHAR(15), 
fecha DATE, 
impresoraID INT NOT NULL,
FOREIGN KEY (impresoraID) REFERENCES impresora(impresoraID),

);

use ImpresorasBD;
select * from impresora
select * from empresa
select * from contrato where nombre = '19-2025-MPS';
select * from area;
select * from consumible;

/*-Insercciones Empresa-*/
INSERT empresa (nombre) VALUES ('Hospital')
INSERT empresa (nombre) VALUES ('SIMNSA')

/*-Insercciones Area-*/
INSERT area (nombre, empresaID) VALUES ('Interlab', '2')
INSERT area (nombre, empresaID) VALUES ('Fundacion', '2')
INSERT area (nombre, empresaID) VALUES ('Juridico', '2')
INSERT area (nombre, empresaID) VALUES ('Estancia infantil', '2')
INSERT area (nombre, empresaID) VALUES ('Administracion operaciones', '2')
INSERT area (nombre, empresaID) VALUES ('Direccion medica S', '2')
INSERT area (nombre, empresaID) VALUES ('Finanzas', '2')
INSERT area (nombre, empresaID) VALUES ('Sistemas', '2')
INSERT area (nombre, empresaID) VALUES ('Sotano EA', '2')
INSERT area (nombre, empresaID) VALUES ('CQX', '2')
INSERT area (nombre, empresaID) VALUES ('Imagenologia', '2')
INSERT area (nombre, empresaID) VALUES ('Compras', '2')
INSERT area (nombre, empresaID) VALUES ('Unident', '2')
INSERT area (nombre, empresaID) VALUES ('Terapia Fisica', '2')
INSERT area (nombre, empresaID) VALUES ('Salud y bienestar', '2')
INSERT area (nombre, empresaID) VALUES ('Medyca', '2')
INSERT area (nombre, empresaID) VALUES ('Clinica metabolica', '2')
INSERT area (nombre, empresaID) VALUES ('Cardiologia', '2')
INSERT area (nombre, empresaID) VALUES ('Especialidades', '2')
INSERT area (nombre, empresaID) VALUES ('Dermalife', '2')
INSERT area (nombre, empresaID) VALUES ('Bajapet', '2')
INSERT area (nombre, empresaID) VALUES ('Easy Park', '2')
INSERT area (nombre, empresaID) VALUES ('Diseno grafico', '2')
INSERT area (nombre, empresaID) VALUES ('Call center', '2')
INSERT area (nombre, empresaID) VALUES ('Recursos humanos S', '2')
INSERT area (nombre, empresaID) VALUES ('Atencion a clientes', '2')
INSERT area (nombre, empresaID) VALUES ('Podologia', '2')
INSERT area (nombre, empresaID) VALUES ('Pediatria', '2')
INSERT area (nombre, empresaID) VALUES ('Rejuvimed', '2')
INSERT area (nombre, empresaID) VALUES ('Oncologia S', '2')
INSERT area (nombre, empresaID) VALUES ('Adminsion', '1')
INSERT area (nombre, empresaID) VALUES ('Urgencias', '1')
INSERT area (nombre, empresaID) VALUES ('Direccion medica H', '1')
INSERT area (nombre, empresaID) VALUES ('Proyectos', '1')
INSERT area (nombre, empresaID) VALUES ('Mantenimiento', '1')
INSERT area (nombre, empresaID) VALUES ('Biomedica', '1')
INSERT area (nombre, empresaID) VALUES ('Almacen', '1')
INSERT area (nombre, empresaID) VALUES ('Ginecologia', '1')
INSERT area (nombre, empresaID) VALUES ('UCI', '1')
INSERT area (nombre, empresaID) VALUES ('Quirofanos', '1')
INSERT area (nombre, empresaID) VALUES ('Hospitalicacion 4to', '1')
INSERT area (nombre, empresaID) VALUES ('Administracion', '1')
INSERT area (nombre, empresaID) VALUES ('Finanzas H', '1')
INSERT area (nombre, empresaID) VALUES ('Farmacia Hospitalaria', '1')
INSERT area (nombre, empresaID) VALUES ('Analisis de cuentas', '1')
INSERT area (nombre, empresaID) VALUES ('Calidad', '1')
INSERT area (nombre, empresaID) VALUES ('Hemodinamia', '1')
INSERT area (nombre, empresaID) VALUES ('Compras H', '1')
INSERT area (nombre, empresaID) VALUES ('Hospitalizacion 5to', '1')
INSERT area (nombre, empresaID) VALUES ('Hospitalizacion 6to', '1')
INSERT area (nombre, empresaID) VALUES ('Direccion General', '2')
INSERT area (nombre, empresaID) VALUES ('Mexalud', '2')
INSERT area (nombre, empresaID) VALUES ('Oncologia H', '1')
INSERT area (nombre, empresaID) VALUES ('Tesoreria', '2')
INSERT area (nombre, empresaID) VALUES ('Modulo de citas', '2')


/*-Insercciones contrato -*/
   INSERT INTO contrato (nombre, empresaID) VALUES ('39-2021-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('37-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('07-2024-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('36-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('48-2021-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('35-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('46-2021-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('17-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('38-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('23-2023-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('13-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('13-2021-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('66-2021-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('40-2021-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('47-2021-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('33-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('01-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('Oncologia H', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('32-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('34-2022-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('16-2021-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('38-2020-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('39-2020-MPS', '1');
   INSERT INTO contrato (nombre, empresaID) VALUES ('41-2021-MPS', '1');

   INSERT INTO contrato (nombre, empresaID) VALUES ('51-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('22-2022-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('01-2023-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('08-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('29-2022-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('12-2022-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('11-2020-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('59-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('10-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('20-2024-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('50-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('02-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('24-2023-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('06-2020-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('09-2018-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('54-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('53-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('30-2022-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('52-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('09-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('07-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('55-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('08-2020-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('58-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('61-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('07-2020-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('01-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('25-2022-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('60-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('07-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('40-2020-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('57-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('16-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('28-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('05-2024-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('31-2022-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('18-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('17-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('13-2020-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('05-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('41-2020-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('10-2023-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('06-2021-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('26-2019-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('03-2023-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('30-2024-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('40-2024-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('10-2025-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('19-2025-MPS', '2');

   

   

/*-Insercciones Impresoras -*/
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1P2D5','ADM HSI TJ HP P6','HP','MFP E52645','192.168.85.227',45,1);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6TH','ADM HSI TJ HP Blanco y Negro','HP','MFP M428dw','192.168.85.227',42,2);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNCRR9533F','ADM HSI TJ HP Color','HP','MFP E47528','192.168.85.34',42,3);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM9M2S4','Administracion TJ HP Operaciones','HP','MFP E52645','192.168.85.136',5,25);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('NDRQ4W6S2','Almacen HSI Sotano  TJ HP Operaciones','HP','MFP M428dw','192.168.85.97',37,4);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC19EHRC','Atencion a Clientes TJ HP Operaciones 01','HP','MFP E52645','192.168.85.114',26,26);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1QCK1CR','Atencion a Clientes TJ HP Operaciones 02','HP','408dn','192.168.85.113',26,27);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCN9X2QJ','BiologiaMolecular TJ HP Operaciones 01','HP','MFP E52645','192.168.85.218',1,28);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1S069','Biomedica HSI TJ Operaciones','HP','MFP E52645','192.168.85.232',36,5);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC19EHR4','Contabilidad TJ HP Operaciones','HP','MFP E52645','192.168.85.152',7,29);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W699','Calidad HSI TJ HP Operaciones','HP','MFP M428dw','192.168.85.21',46,6);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC18OGO6','Cardiologia TJ HP Recepcion','HP','MFP E52645','192.168.85.167',18,30);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMBQ3LG','Clinica Metabolica TJ HP Consultorios 01','HP','E50145','192.168.85.166',17,31);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCP2H0Z8','Clinica Metabolica TJ HP Consultorios 03','HP','E50145','192.168.85.146',17,32);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM9M3W0','Clinica Metabolica TJ HP Recepcion','HP','MFP E52645','192.168.85.168',17,33);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1R6V2K8','Centro Quirurgico TJ HP Enfermeria','HP','408dn','192.168.85.110',10,34);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1P2CZ','Centro Quirurgico TJ HP Recepcion','HP','MFP E52645','192.168.85.92',10,35);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CN95BJY09G','Dermalife TJ HP Recepcion','HP','MFP P57750 XC','192.168.85.153',20,33);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDKL5BCMQ','Direccion Medica TJ HP Operacion','HP','MFP M521dn','192.168.85.163',6,36);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('VNBRR572B8','Direccion General TJ HP Recepcion','HP','MFP M283fdw','192.168.85.188',51,37);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61S1','Especialidades TJ HP Cons 01','HP','E50145','192.168.85.129',19,38);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61TV','Especialidades TJ HP Cons 02','HP','E50145','192.168.85.130',19,38);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61V9','Especialidades TJ HP Cons 03','HP','E50145','192.168.85.131',19,38);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61NL','Especialidades TJ HP Cons 04','HP','E50145','192.168.85.132',19,38);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCM7T3QW','Especialidades TJ HP Cons 05','HP','E50145','192.168.85.133',19,38);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBLL1Y9M3','Especialidades TJ Recepcion','HP','MFP M426fdw','192.168.85.128',19,39);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CN17GMY05M','Estancia Infantil TJ HP Recepcion','HP','MFP P57750','192.168.85.161',4,40);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1P2CX','Farmacia TJ HP Hospitalizacion','HP','MFP E52645','192.168.85.233',44,7);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CN17GMY04K','Fundacion TJ HP Administracion 02','HP','MFP P57750','192.168.85.135',2,41);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC18OGNZ','Finanzas Hospital TJ HP Operaciones 01','HP','MFP E52645','192.168.85.241',43,8);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1S1C6','Finanzas TJ HP Operaciones 02','HP','MFP E52645','192.168.85.43',7,42);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6X6','Ginecologia TJ HP Recepcion','HP','MFP M428dw','192.168.85.33',38,9);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6WW','Ginecologia TJ HP Quirofano','HP','MFP M428dw','192.168.85.179',38,9);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6J3','Ginecologia TJ HP UCIN 01','HP','MFP M428dw','192.168.85.172',38,10);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC18OGNG','Ginecologia TJ HP Central Enfermeria 01','HP','MFP E52645','192.168.85.25',38,11);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1P1L9','Hemodinamia TJ HP Operacion','HP','MFP E52645','192.168.85.225',47,12);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC19EHRL','Hospitalizacion 5 TJ HP Central Enfermeria','HP','MFP E52645','192.168.85.193',49,13);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1S06C','Hospitalizacion TJ HP Central Enfermeria','HP','MFP E52645','192.168.85.230',41,14);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1PCV9VL','Hospitalizacion 5E TJ HP Operaciones 02','HP','408dn','192.168.85.190',49,18);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1P2CC','Hospitalizacion TJ HP Admision Hospitalaria','HP','MFP E52645','192.168.85.234',31,15);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCP2H0Y8','HSI TJ HP Almacen','HP','E50145','192.168.85.253',37,16);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1P2D1','Imagenologia TJ HP Recepcion','HP','MFP E52645','192.168.85.120',11,43);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM5Y23W','Interlab TJ HP Operaciones 01','HP','MFP E52645','192.168.85.121',1,44);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCNDF1DD','Interlab TJ HP Recepcion','HP','MFP E52645','192.168.85.127',1,45);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1P3T0Y6','IT TJ HP Operacion','HP','MFP M432','192.168.85.104',8,46);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CN98VJY0XB','Juridico TJ HP Operaciones','HP','MFP P57750','192.168.85.134',3,47);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC19EHRH','Lobby TJ HP Recepcion','HP','MFP E52645','192.168.85.165',34,17);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6SB','Mantenimiento Sotano HSI','HP','MFP M428dw','192.168.85.59',35,2);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCP2H0Z7','Medical Suites TJ HP Consultorios','HP','E50145','192.168.85.145',28,48);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC19EHR2','Medical Suites TJ HP Recepcion','HP','MFP E52645','192.168.85.144',28,49);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61VG','Medyca TJ HP Consultorios 01','HP','MFP E52645','192.168.85.210',16,50);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBGQ55162','Medyca TJ HP Consultorios 02','HP','M506','192.168.85.139',16,51);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBGQ55164','Medyca TJ HP Consultorios 03','HP','M506','192.168.85.157',16,52);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCP2H0ZB','Medyca TJ HP Consultorios 05','HP','MFP E52645','192.168.85.137',16,53);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM5Y262','Medyca TJ HP Recepcion','HP','MFP E52645','192.168.85.141',16,54);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCN9T0LH','Mexsalud TJ HP Operaciones 03','HP','E50145','192.168.85.174',52,55);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC18OGO3','Oncologia TJ HP Hospitalizacion','HP','MFP E52645','192.168.85.66',53,11);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCP2H0Z0','Pediatria TJ HP Consultorios 01','HP','E50145','192.168.85.185',28,56);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM6K1WV','Pediatria TJ HP Recepcion','HP','MFP E52645','192.168.85.154',28,57);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXFCHC11GZ','Podologia TJ HP Recepcion','HP','MFP M525','192.168.85.106',27,58);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCR9V19V','Proyectos TJ HP Operacion','HP','MFP E52645','192.168.85.19',12,59);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1S15R','Quirofano TJ HP Central de enfermeria','HP','MFP E52645','192.168.85.51',40,19);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W742','Quirofano TJ HP Recepcion','HP','MFP M428dw','192.168.85.158',40,20);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1S06L','Quirofano TJ HP Almacen','HP','MFP E52645','192.168.85.45',40,21);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBGQ55138','Recursos Humanos TJ HP Operaciones 01','HP','M506','192.168.85.251',25,60);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM6K1Q6','Rejuvimed TJ HP Recepcion','HP','MFP E52645','192.168.85.156',29,61);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM6K2GN','Salud y Bienestar TJ HP Recepcion','HP','MFP E52645','192.168.85.155',15,62);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM9M3W8','Tesoreria TJ HP Administracion','HP','MFP E52645','192.168.85.249',54,63);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCNDF1DT','Terapia Fisica TJ HP Recepcion','HP','MFP E52645','192.168.85.197',14,64);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCN9T0LG','Telemedicina TJ HP','HP','E50145DN','192.168.85.138',55,65);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6RP','Unident TJ HP Administracion 01','HP','MFP M428dw','192.168.85.151',13,66);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCN9T07X','Unident TJ HP Consultorios 02','HP','E50145','192.168.85.143',13,67);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBGQ54965','Unident TJ HP Consultorios 03','HP','M506','192.168.85.142',13,67);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCM9M2SD','Unident TJ HP Recepcion','HP','MFP E52645','192.168.85.246',13,68);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCNC21YC','Urgencias TJ HP Administracion','HP','MFP E52645','192.168.85.95',32,22);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCNC21QP','Urgencias TJ HP Admision','HP','MFP E52645','192.168.85.93',32,22);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCNC21VH','Urgencias TJ HP Caja','HP','MFP E52645','192.168.85.180',32,22);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCNC21YF','Urgencias TJ HP Central Enfermeria 01','HP','MFP E52645','192.168.85.96',32,22);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHCCN9T0LK','Urgencias TJ HP Valoracion','HP','E50145','192.168.85.94',32,23);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP2J21Q','Unidad de Cuidados Intensivos TJ HP Central Enfermeria','HP','MFP E52645','192.168.85.231',39,24);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6QN','Veterinaria TJ HP Hospitalizacion','HP','MFP M428dw','192.168.85.123',21,69);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6NQ','Veterinaria TJ HP Recepcion','HP','MFP M428dw','192.168.85.24',21,69);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1S588NQ','Easy Park TJ HP Operaciones','HP','MFP 432','192.168.85.111',22,70);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1N8J2H3','Oncologia TJ HP operaciones 01','HP','MFP 432','192.168.85.247',30,71);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1Q5DHYF','Oftalmologia TJ HP Consultorios','HP','408dn','192.168.85.52',17,72);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1R8F90D','Unident TJ HP Ortodoncia','HP','408dn','192.168.85.250',13,73);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNB1R6V2JZ','Unident TJ HP Odontopediatria','HP','','192.168.85.242',13,);

Select* from impresora where impresoraID='23';
Select* from impresora where serie='MXBCP1S06C';

/*Insercciones cosumibles -*/

INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W2113X', 'TIJ7065', '2025-07-23', 20); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'CF258XC', 'TIJ6800', '2025-06-09', 81); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'CF258XC', 'TIJ7222', '2025-08-14', 81); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', '258XC', 'TIJ7435', '2025-09-08', 71); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'CF287JC', 'TIJ7183', '2025-08-12', 73); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'CE255JC', 'TIJ7458', '2025-09-12', 19); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W1330XC', 'TIJ7437', '2025-09-08', 85); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W1330XC', 'TIJ7438', '2025-09-08', 86); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W1330XC', 'TIJ7436', '2025-09-08', 84); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7559', '2025-09-30', 56); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7583', '2025-10-03', 37); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7241', '2025-08-15', 4); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7543', '2025-09-25', 6); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7460', '2025-09-12', 78); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7460', '2025-09-12', 76); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7504', '2025-09-19', 13); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7542', '2025-09-25', 50); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ5816', '2024-12-30', 60); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7441', '2025-09-09', 66); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ6003', '2025-02-05', 75); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7439', '2025-09-09', 68); /*Si*/ 
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7485', '2025-09-17', 42); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7461', '2025-09-12', 79); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7310', '2025-08-20', 54); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7126', '2025-08-05', 25); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ6452', '2025-04-16', 36); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7186', '2025-08-12', 62); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7185', '2025-08-12', 37); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7503', '2025-09-19', 23); /*Si*/
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7553', '2025-09-26', 38); /*Si*/




INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7311', '2025-08-21', 6);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'CF287JC', 'TIJ7324', '2025-08-27', 53);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7325', '2025-08-27', 51);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'CF287JC', 'TIJ7457', '2025-09-12', 52);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W1330XC', 'TIJ7493', '2025-09-17', 45);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7503', '2025-09-19', 23);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'W9008MC', 'TIJ7504', '2025-09-19', 13);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('W9008MC', 'MXBC19EHRL', 'TIJ6004', '2025-02-05', 62);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('W9008MC', 'PHCCP2H0Y8', 'TIJ7187', '2025-08-12', 63);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('W9008MC', 'MXBCNC21QP', 'TIJ7460', '2025-09-12', 65);
INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('W9008MC', 'MXBCP1P2D5', 'TIJ7462', '2025-09-12', 68);



UPDATE impresora
SET modelo ='MFP E52645'
WHERE impresoraID = 8;

UPDATE impresora
SET modelo ='MFP E52645'
WHERE impresoraID = 9;
						
UPDATE impresora
SET modelo ='E50145'
WHERE impresoraID = 13;

INSERT INTO consumible (tipo, modelo, tij, fecha, impresoraID) VALUES ('Toner', 'CF410X', '410X', '2023-11-15', 5);

Insert impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCNDF1DD','Interlab TJ HP Recepcion', 'HP','MULTIFUNCIONAL E52645DN','192.168.85.127',1,1)

SELECT serie, impresora.nombre, marca, modelo, direccionIp, area.nombre, contrato.nombre FROM impresora INNER JOIN area ON impresora.areaID = area.areaID INNER JOIN contrato ON impresora.contratoID = contrato.contratoID ;

use ImpresorasBD;
SELECT * FROM consumible

SELECT tipo, consumible.modelo, tij, fecha, impresora.nombre, impresora.serie FROM consumible INNER JOIN impresora ON consumible.impresoraID = impresora.impresoraID;

SELECT * FROM impresora;
SELECT direccionIp, modelo FROM impresora

use ImpresorasBD;


UPDATE impresora SET nombre = 'Compras TJ HP Operaciones 02' WHERE serie = 'MXBCR9V19V';

SELECT * FROM impresora;

UPDATE impresora SET toner = 'W9008MC' WHERE modelo = 'E50145DN';


