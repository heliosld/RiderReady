export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  website?: string;
  country?: string;
  description?: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface FixtureCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_category_id?: string;
  created_at: Date;
}

export interface FixtureType {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description?: string;
  created_at: Date;
}

export interface Fixture {
  id: string;
  manufacturer_id: string;
  fixture_type_id: string;
  
  // Basic Information
  name: string;
  model_number?: string;
  slug: string;
  description?: string;
  year_introduced?: number;
  discontinued: boolean;
  
  // Physical Specifications
  weight_kg?: number;
  weight_lbs?: number;
  width_mm?: number;
  height_mm?: number;
  depth_mm?: number;
  
  // Electrical Specifications
  power_consumption_watts?: number;
  voltage?: string;
  power_connector?: string;
  auto_sensing_power: boolean;
  
  // Light Source
  light_source_type?: string;
  light_source_wattage?: number;
  lamp_life_hours?: number;
  color_temperature_kelvin?: number;
  cri_rating?: number;
  
  // Optical Specifications
  total_lumens?: number;
  beam_angle_min?: number;
  beam_angle_max?: number;
  field_angle_min?: number;
  field_angle_max?: number;
  zoom_type?: string;
  
  // Color System
  color_mixing_type?: string;
  color_wheels_count: number;
  
  // Effects
  gobo_wheels_count: number;
  rotating_gobos_count: number;
  static_gobos_count: number;
  animation_wheel: boolean;
  prism: boolean;
  prism_facets?: string;
  frost: boolean;
  iris: boolean;
  shutter_strobe: boolean;
  
  // Control
  dmx_channels_min?: number;
  dmx_channels_max?: number;
  rdm_support: boolean;
  art_net: boolean;
  sacn: boolean;
  wireless_dmx: boolean;
  
  // Pan/Tilt
  pan_range_degrees?: number;
  tilt_range_degrees?: number;
  pan_tilt_16bit: boolean;
  
  // Other Features
  noise_level_db?: number;
  ip_rating?: string;
  
  // Media
  primary_image_url?: string;
  manual_url?: string;
  dmx_chart_url?: string;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface FixtureWithDetails extends Fixture {
  manufacturer?: Manufacturer;
  fixture_type?: FixtureType;
  images?: FixtureImage[];
  features?: Feature[];
}

export interface FixtureImage {
  id: string;
  fixture_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at: Date;
}

export interface Feature {
  id: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  created_at: Date;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  vendor_type?: string;
  
  // Contact Information
  website?: string;
  email?: string;
  phone?: string;
  
  // Address
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  
  // Geographic Information
  latitude?: number;
  longitude?: number;
  service_radius_km?: number;
  
  // Business Information
  established_year?: number;
  description?: string;
  logo_url?: string;
  
  // Metadata
  verified: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VendorInventory {
  id: string;
  vendor_id: string;
  fixture_id: string;
  quantity?: number;
  available_for_rental: boolean;
  available_for_purchase: boolean;
  notes?: string;
  last_updated: Date;
  created_at: Date;
}

export interface DMXMode {
  id: string;
  fixture_id: string;
  mode_name: string;
  channel_count: number;
  description?: string;
  is_default: boolean;
  created_at: Date;
  channels?: DMXChannel[];
}

export interface DMXChannel {
  id: string;
  dmx_mode_id: string;
  channel_number: number;
  channel_name: string;
  channel_function?: string;
  default_value?: number;
}

// Query/Filter interfaces
export interface FixtureFilters {
  manufacturer_id?: string;
  fixture_type_id?: string;
  light_source_type?: string;
  min_weight?: number;
  max_weight?: number;
  min_power?: number;
  max_power?: number;
  min_lumens?: number;
  color_mixing_type?: string;
  has_gobo?: boolean;
  has_prism?: boolean;
  has_zoom?: boolean;
  rdm_support?: boolean;
  discontinued?: boolean;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
