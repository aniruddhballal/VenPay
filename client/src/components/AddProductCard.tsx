import React from "react";

const MAX_DESCRIPTION_LENGTH = 96;
const MAX_NAME_LENGTH = 18;

// Add Product Card Component
export const AddProductCard = ({ 
  form, 
  onFormChange, 
  onSubmit, 
  onImageChange, 
  selectedImage, 
  previewUrl, 
  isSubmitting, 
  uploadingImage, 
  fileInputRef,
  editingId,
  onCancel
}: {
  form: { name: string; description: string; price: string };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: File | null;
  previewUrl: string;
  isSubmitting: boolean;
  uploadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  editingId: string | null;
  onCancel: () => void;
}) => {
  return (
    <div className="expand-card-compact add-product-card" style={{
      border: '2px dashed #007bff',
      backgroundColor: '#f8f9ff',
      transition: 'all 0.2s ease'
    }}>
      <form onSubmit={onSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="image-section">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected product"
              className="product-image"
              style={{ borderRadius: '8px' }}
            />
          ) : (
            <div 
              className="image-placeholder"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {selectedImage ? selectedImage.name : 'Click to add image'}
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="basic-info" style={{ marginBottom: '12px' }}>
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              maxLength={MAX_NAME_LENGTH}
              style={{
                width: '80%',
                padding: '8px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            />
            {/*Add character counter for name in AddProductCard:*/}
            <div style={{ 
              fontSize: '12px', 
              color: form.name.length > MAX_NAME_LENGTH * 0.9 ? '#dc2626' : '#666',
              textAlign: 'left',
              marginTop: '4px'
            }}>
              Name: {form.name.length}/{MAX_NAME_LENGTH}
            </div>
            <input
              name="price"
              placeholder="Price (₹)"
              type="number"
              step="1"
              value={form.price}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              style={{
                width: '52%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                marginLeft: '10px'
              }}
            />
          </div>
          
          <div className="details" style={{ flex: 1, marginBottom: '12px' }}>
            <textarea
              name="description"
              placeholder="Product Description"
              value={form.description}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              rows={3}
              maxLength={MAX_DESCRIPTION_LENGTH} // Add this line
              style={{
                width: '100%',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical',
                maxHeight: '70px',
              }}
            />
          {/*Add character counter below the textarea in AddProductCard:*/}
            <div style={{ 
              fontSize: '12px', 
              color: form.description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? '#dc2626' : '#666',
              textAlign: 'right',
              marginTop: '4px'
            }}>
              {form.description.length}/{MAX_DESCRIPTION_LENGTH}
            </div>
          </div>
          <div className="actions">
            <button 
              type="submit" 
              className="btn btn-success btn-small"
              disabled={isSubmitting || uploadingImage}
              style={{ marginRight: '8px' }}
            >
              {isSubmitting ? (
                <>
                  <span>⏳</span>
                  {editingId ? (
                    selectedImage ? ' Updating...' : ' Updating...'
                  ) : (
                    selectedImage ? ' Creating...' : ' Creating...'
                  )}
                </>
              ) : (
                <>
                  <span>{editingId ? '💾' : '➕'}</span>
                  {editingId ? ' Update' : ' Create'}
                </>
              )}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-cancel btn-small"
                disabled={isSubmitting}
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};