const STORAGE_KEY = "madhayana_receipt_templates_v2";

function readTemplates() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Template gagal dibaca:", error);
    return [];
  }
}

function writeTemplates(templates) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(templates)
  );

  window.dispatchEvent(
    new CustomEvent("madhayana-template-change")
  );
}

export function getReceiptTemplates(sellerId) {
  return readTemplates()
    .filter((template) => template.sellerId === sellerId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
    );
}

export function saveReceiptTemplate({
  sellerId,
  sellerName,
  templateName,
  fileName,
  data,
  fields,
  templateCells,
}) {
  if (!sellerId) {
    throw new Error("Identitas reseller tidak ditemukan.");
  }

  if (!templateName?.trim()) {
    throw new Error("Nama template wajib diisi.");
  }

  const templates = readTemplates();
  const sellerTemplates = templates.filter(
    (template) => template.sellerId === sellerId
  );

  const now = new Date().toISOString();
  const templateId = crypto.randomUUID();

  const newTemplate = {
    id: templateId,
    sellerId,
    sellerName: sellerName || "Reseller",
    templateName: templateName.trim(),
    fileName,
    category: "Struk",
    data,
    fields,
    templateCells,
    isDefault: sellerTemplates.length === 0,
    createdAt: now,
    updatedAt: now,
  };

  writeTemplates([...templates, newTemplate]);

  return newTemplate;
}

export function renameReceiptTemplate({
  sellerId,
  templateId,
  templateName,
}) {
  if (!templateName?.trim()) {
    throw new Error("Nama template wajib diisi.");
  }

  const templates = readTemplates().map((template) =>
    template.id === templateId &&
    template.sellerId === sellerId
      ? {
          ...template,
          templateName: templateName.trim(),
          updatedAt: new Date().toISOString(),
        }
      : template
  );

  writeTemplates(templates);
}

export function setDefaultReceiptTemplate({
  sellerId,
  templateId,
}) {
  const templates = readTemplates().map((template) => {
    if (template.sellerId !== sellerId) {
      return template;
    }

    return {
      ...template,
      isDefault: template.id === templateId,
      updatedAt:
        template.id === templateId
          ? new Date().toISOString()
          : template.updatedAt,
    };
  });

  writeTemplates(templates);
}

export function deleteReceiptTemplate({
  sellerId,
  templateId,
}) {
  const templates = readTemplates();
  const target = templates.find(
    (template) =>
      template.id === templateId &&
      template.sellerId === sellerId
  );

  const remaining = templates.filter(
    (template) =>
      !(
        template.id === templateId &&
        template.sellerId === sellerId
      )
  );

  if (target?.isDefault) {
    const nextDefault = remaining.find(
      (template) => template.sellerId === sellerId
    );

    if (nextDefault) {
      nextDefault.isDefault = true;
      nextDefault.updatedAt = new Date().toISOString();
    }
  }

  writeTemplates(remaining);
}

export function getDefaultReceiptTemplate(sellerId) {
  return (
    getReceiptTemplates(sellerId).find(
      (template) => template.isDefault
    ) || null
  );
}

export function updateReceiptTemplateCategory({
  sellerId,
  templateId,
  category,
}) {
  const allowedCategories = [
    "Struk",
    "Invoice",
    "Sertifikat",
  ];

  if (!allowedCategories.includes(category)) {
    throw new Error("Kategori template tidak valid.");
  }

  const templates = readTemplates().map((template) =>
    template.id === templateId &&
    template.sellerId === sellerId
      ? {
          ...template,
          category,
          updatedAt: new Date().toISOString(),
        }
      : template
  );

  writeTemplates(templates);
}
