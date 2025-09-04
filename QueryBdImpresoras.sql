drop database ImpresorasBD;

Create Database ImpresorasBD;

use ImpresorasBD;

Create table empresa(

empresaID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
nombre varchar(20)

);


create table area(

areaID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
nombre VARCHAR(30),
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
nombre VARCHAR(30),
marca VARCHAR(15),
modelo VARCHAR(30),
direccionIp VARCHAR(15),
areaID INT NOT NULL,
contratoID INT NOT NULL,
FOREIGN KEY (areaID) REFERENCES area(areaID),
FOREIGN KEY (contratoID) REFERENCES contrato(contratoID),

);


create table consumible(

consumibleID INT NOT NULL PRIMARY KEY IDENTITY(1,1),
tipo VARCHAR(15), 
modelo VARCHAR(15), 
tij VARCHAR(15), 
fecha DATE, 
impresoraID INT NOT NULL,
FOREIGN KEY (impresoraID) REFERENCES impresora(impresoraID),

);

select * from impresora
select * from empresa
select * from contrato;
select * from area;
select * from consumible;

/*-Insercciones Empresa-*/
INSERT empresa (nombre) VALUES ('Hospital')
INSERT empresa (nombre) VALUES ('SIMNSA')

/*-Insercciones Area-*/
INSERT area (nombre, empresaID) VALUES ('Interlab', '2')
INSERT area (nombre, empresaID) VALUES ('Fundacion', '2')
INSERT area (nombre, empresaID) VALUES ('Juridico', '2')
INSERT area (nombre, empresaID) VALUES ('Estancia Infantil', '2')
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
INSERT area (nombre, empresaID) VALUES ('Clinica Metabolica', '2')
INSERT area (nombre, empresaID) VALUES ('Cardiologia', '2')
INSERT area (nombre, empresaID) VALUES ('Especialidades', '2')
INSERT area (nombre, empresaID) VALUES ('Dermalife', '2')
INSERT area (nombre, empresaID) VALUES ('Bajapet', '2')
INSERT area (nombre, empresaID) VALUES ('Easy Park', '2')
INSERT area (nombre, empresaID) VALUES ('Dise�o grafico', '2')
INSERT area (nombre, empresaID) VALUES ('Call center', '2')
INSERT area (nombre, empresaID) VALUES ('Recursos humanos S', '2')
INSERT area (nombre, empresaID) VALUES ('Atencion a clientes', '2')
INSERT area (nombre, empresaID) VALUES ('Podologia', '2')
INSERT area (nombre, empresaID) VALUES ('Pediatria', '2')
INSERT area (nombre, empresaID) VALUES ('Rejuvimed', '2')
INSERT area (nombre, empresaID) VALUES ('Oncologia', '2')
INSERT area (nombre, empresaID) VALUES ('Adminsion', '1')
INSERT area (nombre, empresaID) VALUES ('Urgencias', '1')
INSERT area (nombre, empresaID) VALUES ('Direccion medica H', '1')
INSERT area (nombre, empresaID) VALUES ('Proyectos', '1')
INSERT area (nombre, empresaID) VALUES ('Mantenimiento', '1')
INSERT area (nombre, empresaID) VALUES ('Biomedica', '1')
INSERT area (nombre, empresaID) VALUES ('Almacen', '1')
INSERT area (nombre, empresaID) VALUES ('Ginecologia', '1')
INSERT area (nombre, empresaID) VALUES ('UCI', '1')
INSERT area (nombre, empresaID) VALUES ('QUIROFANOS', '1')
INSERT area (nombre, empresaID) VALUES ('Hospitalicacion 4to', '1')
INSERT area (nombre, empresaID) VALUES ('Administracion', '1')
INSERT area (nombre, empresaID) VALUES ('Finanzas', '1')
INSERT area (nombre, empresaID) VALUES ('Farmacia Hospitalaria', '1')
INSERT area (nombre, empresaID) VALUES ('Analisis de cuentas', '1')
INSERT area (nombre, empresaID) VALUES ('Calidad', '1')
INSERT area (nombre, empresaID) VALUES ('Hemodinamia', '1')
INSERT area (nombre, empresaID) VALUES ('Compras H', '1')
INSERT area (nombre, empresaID) VALUES ('Hospitalizacion 5to', '1')
INSERT area (nombre, empresaID) VALUES ('Hospitalizacion 6to', '1')

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
   INSERT INTO contrato (nombre, empresaID) VALUES ('30-2024-MPS', '2');
   INSERT INTO contrato (nombre, empresaID) VALUES ('Oncologia S', '2');

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
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDKL5BCMQ','Direccion Medica TJ HP Operacion','HP','MFP M521dn','192.168.85.163',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('VNBRR572B8','Direccion General TJ HP Recepcion','HP','MFP M283fdw','192.168.85.188',51,37);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61S1','Especialidades TJ HP Cons 01','HP','E50145','192.168.85.129',19,38);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61TV','Especialidades TJ HP Cons 02','HP','E50145','192.168.85.130',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61V9','Especialidades TJ HP Cons 03','HP','E50145','192.168.85.131',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCMC61NL','Especialidades TJ HP Cons 04','HP','E50145','192.168.85.132',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBCM7T3QW','Especialidades TJ HP Cons 05','HP','E50145','192.168.85.133',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('PHBLL1Y9M3','Especialidades TJ Recepcion','HP','MFP M426Fdw','192.168.85.128',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CN17GMY05M','Estancia Infantil TJ HP Recepcion','HP','MFP P57750','192.168.85.161',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1P2CX','Farmacia TJ HP Hospitalizacion','HP','MPF E52645','192.168.85.233',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CN17GMY04K','Fundacion TJ HP Administracion 02','HP','MPF P57750dw','192.168.85.135',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC18OGNZ','Finanzas Hospita TJ HP Operaciones 01','HP','E52645','192.168.85.241',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1S1C6','Finanzas TJ HP Operaciones 02','HP','E52645','192.168.85.43',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6X6','Ginecologia TJ HP Recepcion','HP','MFP M428dw','192.168.85.33',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6WW','Ginecologia TJ HP Quirofano','HP','MFP M428dw','192.168.85.179',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('CNDRQ4W6J3','Ginecologia TJ HP UCIN 01','HP','MFP M428dw','192.168.85.172',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC18OGNG','Ginecologia TJ HP Central Enfermeria 01','HP','E52645','192.168.85.25',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCP1P1L9','Hemodinamia TJ HP Operacion','HP','E52645','192.168.85.225',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBC19EHRL','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);
INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('','','HP','','',,);


Contratro	Marca	Modelo 	Serie	Nombre	IP	Column1		

46-2021-MPS
53-2021-MPS	
17-022-MPS		
30-2022-MPS	
38-2022-MPS	
38-2022-MPS	
23-2023-MPS	
13-2022-MPS 		
13-2021-MPS	
66-2021-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBC19EHRL	Hospitalizacion 5 TJ HP Central Enfermeria / ECP5	192.168.85.193	
40-2021-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCP1S06C	Hospitalizacion TJ HP Central Enfermeria / ECP4	192.168.85.230	
13-2022-MPS 	HP	MULTIFUNCIONAL E52645DN	MXBC18OG03	Hospitalizacion 5E TJ HP Operaciones 02	192.168.85.190	
47-2021-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBCP1P2CC 	Hospitalizacion TJ HP Admision Hospitalaria /ECP1	192.168.85.234	
33-2022-MPS	HP	IMPRESORA E50145DN	PHCCP2H0Y8	 HSI TJ HP Almacen	192.168.85.253	
52-2021-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCP1P2D1	Imagenologia TJ HP Recepcion / EAP2	192.168.85.120	
09-2019-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCM5Y23W	Interlab TJ HP Operaciones 01 / EBP1	192.168.85.121	
07-2021-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCNDF1DD	Interlab TJ HP Recepcion / EBP1	192.168.85.127	
55-2021-MPS	HP	MULTIFUNCIONAL M432	CNB1P3T0Y6	IT TJ HP Operacion	192.168.85.104	
08-2020-MPS	HP	MULTIFUNCIONAL P57750DW	CN97QJY0G6 -- Backup(CN98VJY0XB)	Juridico TJ HP Operaciones / EBP3	192.168.85.134	
01-2022-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBC19EHRH 	Lobby TJ HP Recepcion 	192.168.85.165 	
37-2022-MPS	HP	MULTIFUNCIONAL M428DW	CNDRQ4W6SB	Mantenimiento Sotano HSI	192.168.85.59	
58-2021-MPS	HP	IMPRESORA E50145DN,	PHCCP2H0Z7 	Medical Suites TJ HP Consultorios 01 / 	192.168.85.145	
61-2021-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBC19EHR2 	Medical Suites TJ HP Recepcion / 	192.168.85.144	
07-2020-MPS	HP	MULTIFUNCIONAL E52645DN,	PHBCMC61VG	Medyca TJ HP Consultorios 01 / EAP5	192.168.85.210	
01-2019-MPS 	HP	MULTIFUNCIONAL M506	PHBGQ55162	Medyca TJ HP Consultorios 02	192.168.85.139	
25-2022-MPS 	HP	IMPRESORA M506	PHBGQ55164	Medyca TJ HP Consultorios 03 / EAP5	192.168.85.157	
60-2021-MPS	HP	MULTIFUNCIONAL E52645DN,	PHCCP2H0ZB	Medyca TJ HP Consultorios 05 / EAP5	192.168.85.137	
07-2019-MPS 	HP	MULTIFUNCIONAL E52645DN	MXBCM5Y262	Medyca TJ HP Recepcion / EAP5	192.168.85.141	
40-2020-MPS	HP	MULTIFUNCIONAL E52645DN,	PHCCN9T0LH	Mexsalud TJ HP Operaciones 03	192.168.85.174	
Oncologia	HP	Laser 408	CNB1PCV9VL	Oncologia TJ HP Hospitalizacion	192.168.85.66	
57-2021-MPS	HP	IMPRESORA E50145DN,	PHCCP2H0Z0	Pediatria TJ HP Consultorios 01 / EAP3	192.168.85.185	
16-2019-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBCM6K1WV	Pediatria TJ HP Recepcion / EFP5	192.168.85.154	
28-2019-MPS	HP	HP LaserJet 500 MFP M525	MXFCHC11GZ	Podologia TJ HP Recepcion /	192.168.85.106	
05-2024-MPS	HP	HP LaserJet MFP E52645	MXBCR9V19V	Proyectos TJ HP Operacion / EBP2	192.168.85.19	
32-2022-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCP1S15R	Quirofano TJ HP Central de enfermeria	192.168.85.51	
34-2022-MPS	HP	MULTIFUNCIONAL M428DW	CNDRQ4W742	Quirofano TJ HP Recepcion	192.168.85.158	
16-2021-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBCP1S06L	Quirofano TJ HP Almacen	192.168.85.45	
31-2022-MPS	HP	MULTIFUNCIONAL M506DN	PHBGQ55138	Recursos Humanos TJ HP Operaciones 01 / EBP4	192.168.85.251	
18-2019-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBCM6K1Q6	Rejuvimed TJ HP Recepcion / Torre F - 6to Piso	192.168.85.156	
17-2019-MPS	HP	MULTIFUNCIONAL HP M428DN,	MXBCM6K2GN	Salud y Bienestar TJ HP Recepcion / EAP4	192.168.85.155	
13-2020-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCM9M3W8	Tesoreria TJ HP Administracion / EBP3	192.168.85.249	
05-2021-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBCNDF1DT	Terapia Fisica TJ HP Recepcion	192.168.85.197	
41-2020-MPS	HP	IMPRESORA E50145DN	PHCCN9T0LG	Telemedicina TJ HP	192.168.85.138	
10-2023-MPS	HP	MULTIFUNCIONAL HP M428DN	CNDRQ4W6RP	Unident TJ HP Administracion 01 / EAP3	192.168.85.151	
06-2021-MPS	HP	MULTIFUNCIONAL E52645DN,	PHCCN9T07X	Unident TJ HP Consultorios 02 / EAP3	192.168.85.143	
06-2021-MPS	HP	IMPRESORA E50145DN	PHBGQ54965	Unident TJ HP Consultorios 03 / EAP3	192.168.85.142	
26-2019-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBCM9M2SD	Unident TJ HP Recepcion / EAP3	192.168.85.246	
38-2020-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCNC21YC	Urgencias TJ HP Administracion / ECP1	192.168.85.95	
38-2020-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCNC21QP	Urgencias TJ HP Admision / ECP1	192.168.85.93	
38-2020-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBCNC21VH	Urgencias TJ HP Caja / ECP1	192.168.85.180	
38-2020-MPS	HP	MULTIFUNCIONAL E52645DN,	MXBCNC21YF	Urgencias TJ HP Central Enfermeria 01 / ECP1	192.168.85.96	
39-2020-MPS	HP	MULTIFUNCIONAL E52645DN,	PHCCN9T0LK	Urgencias TJ HP Valoracion / ECP1	192.168.85.94	
41-2021-MPS	HP	MULTIFUNCIONAL E52645DN	MXBCP2J21Q	Unidad de Cuidados Intensivos TJ HP Central Enfermeria	192.168.85.231	
03-2023-MPS	HP	MULTIFUNCIONAL HP M428DN	CNDRQ4W6QN	Veterinaria TJ HP Hospitalizacion	192.168.85.123	
03-2023-MPS	HP	MULTIFUNCIONAL HP M428DN	CNDRQ4W6NQ	Veterinaria TJ HP Recepcion	192.168.85.24	
30-2024-MPS	HP	MULTIFUNCIONAL M432	CNB1S588NQ	Easy Park TJ HP Operaciones	192.168.85.111	
Oncologia S	HP 	HP Laser 408dn	CNB1N8J2H3	Oncologia TJ HP operaciones 01	192.168.85.247	W1330X
oftamologia			CNB1Q5DHYF	Oftalmologia TJ HP Consultorios 01	192.168.85.52	W1330XC
unident	HP 	HP Laser 408dn	CNB1R98F90D	Unident TJ HP Ortodoncia	192.168.85.250	W1330XC
unident			CNB1R6V2JZ	Unident TJ HP Odontopediatria	192.168.85.242	

UPDATE impresora
SET modelo ='MFP E52645'
WHERE impresoraID = 6;

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