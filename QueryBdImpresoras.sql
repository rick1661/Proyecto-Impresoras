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
select * from consumible

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
INSERT area (nombre, empresaID) VALUES ('Diseño grafico', '2')
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
INSERT area (nombre, empresaID) VALUES ('', '1')




Insert impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID ) VALUES ('MXBCNDF1DD','Interlab TJ HP Recepcion', 'HP','MULTIFUNCIONAL E52645DN','192.168.85.127',1,1)

SELECT serie, impresora.nombre, marca, modelo, direccionIp, area.nombre, contrato.nombre FROM impresora INNER JOIN area ON impresora.areaID = area.areaID INNER JOIN contrato ON impresora.contratoID = contrato.contratoID ;