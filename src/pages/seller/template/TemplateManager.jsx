import { useMemo, useState } from "react";

const CATEGORIES = [
  "Semua",
  "Struk",
  "Invoice",
  "Sertifikat",
];

function getTemplateIcon(category) {
  if (category === "Invoice") {
    return "fi fi-rr-file-invoice";
  }

  if (category === "Sertifikat") {
    return "fi fi-rr-diploma";
  }

  return "fi fi-rr-receipt";
}

export default function TemplateManager({
  templates = [],
  selectedTemplateId,
  onPreview,
  onRename,
  onSetDefault,
  onDelete,
  onChangeCategory,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const filteredTemplates = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return templates.filter((template) => {
      const templateCategory =
        template.category || "Struk";

      const matchesCategory =
        category === "Semua" ||
        templateCategory === category;

      const matchesSearch =
        !keyword ||
        String(template.templateName || "")
          .toLowerCase()
          .includes(keyword) ||
        String(template.fileName || "")
          .toLowerCase()
          .includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [templates, search, category]);

  return (
    <section className="receipt-template-manager">
      <header className="receipt-manager-header">
        <div>
          <span className="modern-eyebrow">
            TEMPLATE RESELLER
          </span>

          <h2>Template Saya</h2>

          <p>
            Cari, lihat, ubah, dan tentukan template
            utama untuk transaksi.
          </p>
        </div>

        <div className="receipt-template-count">
          <i className="fi fi-rr-folder-open" />
          {templates.length}
        </div>
      </header>

      <div className="receipt-manager-toolbar">
        <label className="receipt-template-search">
          <i className="fi fi-rr-search" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Cari template..."
          />
        </label>

        <label className="receipt-template-filter">
          <i className="fi fi-rr-filter" />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item === "Semua"
                  ? "Semua kategori"
                  : item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="receipt-template-empty">
          <div>
            <i className="fi fi-rr-file-excel" />
          </div>

          <h3>Template belum ditemukan</h3>

          <p>
            Unggah template baru atau gunakan kata
            pencarian lainnya.
          </p>
        </div>
      ) : (
        <div className="receipt-template-grid">
          {filteredTemplates.map((template) => {
            const templateCategory =
              template.category || "Struk";

            return (
              <article
                key={template.id}
                className={
                  selectedTemplateId === template.id
                    ? "selected"
                    : ""
                }
              >
                <div className="receipt-template-card-top">
                  <div className="receipt-template-main-icon">
                    <i
                      className={getTemplateIcon(
                        templateCategory
                      )}
                    />
                  </div>

                  {template.isDefault && (
                    <span className="receipt-default-badge">
                      <i className="fi fi-sr-star" />
                      Default
                    </span>
                  )}
                </div>

                <div className="receipt-template-info">
                  <span>{templateCategory}</span>

                  <h3>{template.templateName}</h3>

                  <p>{template.fileName}</p>
                </div>

                <label className="receipt-category-field">
                  <span>
                    <i className="fi fi-rr-folder" />
                    Kategori
                  </span>

                  <select
                    value={templateCategory}
                    onChange={(event) =>
                      onChangeCategory(
                        template,
                        event.target.value
                      )
                    }
                  >
                    <option value="Struk">
                      Struk
                    </option>
                    <option value="Invoice">
                      Invoice
                    </option>
                    <option value="Sertifikat">
                      Sertifikat
                    </option>
                  </select>
                </label>

                <div className="receipt-template-actions">
                  <button
                    type="button"
                    className="preview"
                    onClick={() =>
                      onPreview(template)
                    }
                    title="Preview template"
                  >
                    <i className="fi fi-rr-eye" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onRename(template)
                    }
                    title="Ubah nama"
                  >
                    <i className="fi fi-rr-edit" />
                  </button>

                  <button
                    type="button"
                    className={
                      template.isDefault
                        ? "is-default"
                        : ""
                    }
                    disabled={template.isDefault}
                    onClick={() =>
                      onSetDefault(template)
                    }
                    title={
                      template.isDefault
                        ? "Template default"
                        : "Jadikan default"
                    }
                  >
                    <i
                      className={
                        template.isDefault
                          ? "fi fi-sr-star"
                          : "fi fi-rr-star"
                      }
                    />
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      onDelete(template)
                    }
                    title="Hapus template"
                  >
                    <i className="fi fi-rr-trash" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
