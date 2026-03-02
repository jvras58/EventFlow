/*
  Warnings:

  - You are about to drop the column `ativa` on the `RegraCheckin` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `RegraCheckin` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `RegraCheckin` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `User` table. All the data in the column will be lost.
  - Added the required column `encerrarMinDepois` to the `RegraCheckin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liberarMinAntes` to the `RegraCheckin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeRegra` to the `RegraCheckin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "local" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Evento" ("createdAt", "data", "id", "local", "nome") SELECT "createdAt", "data", "id", "local", "nome" FROM "Evento";
DROP TABLE "Evento";
ALTER TABLE "new_Evento" RENAME TO "Evento";
CREATE TABLE "new_Participante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "checkIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Participante_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Participante" ("createdAt", "email", "eventoId", "id", "nome") SELECT "createdAt", "email", "eventoId", "id", "nome" FROM "Participante";
DROP TABLE "Participante";
ALTER TABLE "new_Participante" RENAME TO "Participante";
CREATE UNIQUE INDEX "Participante_email_eventoId_key" ON "Participante"("email", "eventoId");
CREATE TABLE "new_RegraCheckin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventoId" TEXT NOT NULL,
    "nomeRegra" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "obrigatorio" BOOLEAN NOT NULL DEFAULT true,
    "liberarMinAntes" INTEGER NOT NULL,
    "encerrarMinDepois" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RegraCheckin_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RegraCheckin" ("eventoId", "id") SELECT "eventoId", "id" FROM "RegraCheckin";
DROP TABLE "RegraCheckin";
ALTER TABLE "new_RegraCheckin" RENAME TO "RegraCheckin";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nome" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("email", "id") SELECT "email", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
