import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ── Enums ──
export const hospitalLevelEnum = pgEnum("hospital_level", [
  "FIRST",
  "SECOND",
  "THIRD",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "BASIC",
  "STANDARD",
  "PREMIUM",
]);

export const hospitalUserRoleEnum = pgEnum("hospital_user_role", [
  "ADMIN",
  "OPERATOR",
  "VIEWER",
]);

export const serviceCategoryEnum = pgEnum("service_category", [
  "EMERGENCY",
  "CONSULTATION",
  "SURGERY",
  "LAB",
  "IMAGING",
]);

export const severityEnum = pgEnum("severity", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "EMERGENCY",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
  "COMPLETED",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "EMAIL",
  "SMS",
  "PUSH",
]);

export const notificationEventEnum = pgEnum("notification_event", [
  "REQUEST_SENT",
  "ACCEPTED",
  "REJECTED",
  "REMINDER",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "QUEUED",
  "SENT",
  "FAILED",
  "BOUNCED",
]);

export const adminRoleEnum = pgEnum("admin_role", [
  "SUPERADMIN",
  "MANAGER",
  "SUPPORT",
]);

// ── Tables ──

export const hospitals = pgTable(
  "hospitals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    level: hospitalLevelEnum("level").notNull(),
    address: text("address").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }).notNull(),
    logoUrl: text("logo_url"),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    isPremium: boolean("is_premium").notNull().default(false),
    subscriptionTier: subscriptionTierEnum("subscription_tier")
      .notNull()
      .default("BASIC"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("hospitals_slug_idx").on(table.slug)]
);

export const hospitalUsers = pgTable("hospital_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id")
    .notNull()
    .references(() => hospitals.id),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: hospitalUserRoleEnum("role").notNull().default("OPERATOR"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: serviceCategoryEnum("category").notNull(),
  description: text("description"),
  levelRequired: hospitalLevelEnum("level_required").notNull(),
});

export const hospitalServices = pgTable("hospital_services", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id")
    .notNull()
    .references(() => hospitals.id),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  priceMin: decimal("price_min", { precision: 10, scale: 2 }).notNull(),
  priceMax: decimal("price_max", { precision: 10, scale: 2 }),
  isAvailable: boolean("is_available").notNull().default(true),
  estimatedWait: integer("estimated_wait"),
});

export const symptoms = pgTable("symptoms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  keywords: text("keywords").array().notNull(),
  severity: severityEnum("severity").notNull(),
  suggestedLevel: hospitalLevelEnum("suggested_level").notNull(),
  description: text("description"),
});

export const symptomServices = pgTable("symptom_services", {
  symptomId: uuid("symptom_id")
    .notNull()
    .references(() => symptoms.id),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  relevance: integer("relevance").notNull(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id")
    .notNull()
    .references(() => hospitals.id),
  hospitalServiceId: uuid("hospital_service_id")
    .notNull()
    .references(() => hospitalServices.id),
  verificationCode: varchar("verification_code", { length: 8 })
    .notNull()
    .unique(),
  status: appointmentStatusEnum("status").notNull().default("PENDING"),
  patientName: varchar("patient_name", { length: 255 }).notNull(),
  patientEmail: varchar("patient_email", { length: 255 }).notNull(),
  patientPhone: varchar("patient_phone", { length: 20 }).notNull(),
  symptomDescription: text("symptom_description").notNull(),
  symptomId: uuid("symptom_id").references(() => symptoms.id),
  patientLatitude: decimal("patient_latitude", { precision: 10, scale: 7 }),
  patientLongitude: decimal("patient_longitude", { precision: 10, scale: 7 }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointments.id),
  type: notificationTypeEnum("type").notNull(),
  event: notificationEventEnum("event").notNull(),
  recipient: varchar("recipient", { length: 255 }).notNull(),
  status: notificationStatusEnum("status").notNull().default("QUEUED"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  errorMessage: text("error_message"),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: adminRoleEnum("role").notNull().default("SUPPORT"),
});
