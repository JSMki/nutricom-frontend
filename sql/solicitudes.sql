IF OBJECT_ID(N'dbo.solicitudes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.solicitudes (
        id INT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_solicitudes PRIMARY KEY,
        usuario_id INT NOT NULL,
        tipo NVARCHAR(80) NOT NULL,
        descripcion NVARCHAR(1000) NOT NULL,
        integrantes SMALLINT NOT NULL
            CONSTRAINT CK_solicitudes_integrantes CHECK (integrantes BETWEEN 1 AND 30),
        prioridad NVARCHAR(10) NOT NULL
            CONSTRAINT DF_solicitudes_prioridad DEFAULT (N'Baja')
            CONSTRAINT CK_solicitudes_prioridad CHECK (prioridad IN (N'Baja', N'Media', N'Alta')),
        estado NVARCHAR(20) NOT NULL
            CONSTRAINT DF_solicitudes_estado DEFAULT (N'Pendiente')
            CONSTRAINT CK_solicitudes_estado CHECK (estado IN (N'Pendiente', N'Aprobada', N'Rechazada')),
        fecha_creacion DATETIME2(0) NOT NULL
            CONSTRAINT DF_solicitudes_fecha_creacion DEFAULT (SYSUTCDATETIME())
    );
END;
GO

IF COL_LENGTH(N'dbo.solicitudes', N'prioridad') IS NULL
BEGIN
    ALTER TABLE dbo.solicitudes
        ADD prioridad NVARCHAR(10) NOT NULL
            CONSTRAINT DF_solicitudes_prioridad DEFAULT (N'Baja') WITH VALUES;
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = N'CK_solicitudes_prioridad'
      AND parent_object_id = OBJECT_ID(N'dbo.solicitudes')
)
BEGIN
    ALTER TABLE dbo.solicitudes
        ADD CONSTRAINT CK_solicitudes_prioridad
        CHECK (prioridad IN (N'Baja', N'Media', N'Alta'));
END;
GO

IF OBJECT_ID(N'dbo.solicitud_alimentos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.solicitud_alimentos (
        solicitud_id INT NOT NULL,
        alimento_id INT NOT NULL,
        nombre_alimento NVARCHAR(120) NOT NULL,
        unidad_medida NVARCHAR(40) NOT NULL,
        cantidad SMALLINT NOT NULL
            CONSTRAINT CK_solicitud_alimentos_cantidad CHECK (cantidad BETWEEN 1 AND 99),
        CONSTRAINT PK_solicitud_alimentos PRIMARY KEY (solicitud_id, alimento_id),
        CONSTRAINT FK_solicitud_alimentos_solicitudes
            FOREIGN KEY (solicitud_id) REFERENCES dbo.solicitudes(id)
            ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_solicitudes_usuario_fecha'
      AND object_id = OBJECT_ID(N'dbo.solicitudes')
)
BEGIN
    CREATE INDEX IX_solicitudes_usuario_fecha
        ON dbo.solicitudes (usuario_id, fecha_creacion DESC);
END;
GO

/*
  Integra usuario_id con la clave primaria real de tu tabla de usuarios.
  Si la tabla existente es dbo.usuarios(id INT), puedes habilitar esta FK:

  ALTER TABLE dbo.solicitudes
      ADD CONSTRAINT FK_solicitudes_usuarios
      FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id);

  alimento_id conserva el ID del catálogo, pero no se agregó una FK porque
  el nombre y la clave real de la tabla de alimentos no están definidos aquí.
*/
