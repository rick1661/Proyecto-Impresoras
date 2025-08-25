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
impresoraID INT NOT NULL,
tij VARCHAR(15),
FOREIGN KEY (impresoraID) REFERENCES impresora(impresoraID),

);

select * from impresora
select * from empresa
select * from contrato;
select * from area;
select * from consumible


