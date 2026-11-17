# Referencia: parámetros de efectos (matchNames) en AE 2026

Sacado de After Effects 26.5 del PC del autor con un script el 29/09/2026. Formato: `## matchName = nombre visible` y debajo `-000N:Parámetro=valor por defecto`. El nombre interno completo es el matchName + el sufijo, p. ej. `ADBE Glo2-0003` = Glow Radius. Úsalo para automatizar AE por script: los nombres visibles cambian con el idioma de AE, los matchNames no.

## ADBE Fractal Noise = Fractal Noise
-0001:Fractal Type=1 | -0002:Noise Type=3 | -0003:Invert=0 | -0004:Contrast=100 | -0005:Brightness=0 | -0006:Overflow=4 | -0007:Transform | -0008:Rotation=0 | -0009:Uniform Scaling=1 | -0010:Scale=100 | -0011:Scale Width=100 | -0012:Scale Height=100 | -0013:Offset Turbulence=50,50 | -0031:Perspective Offset=0 | -0014: | -0015:Complexity=6 | -0016:Sub Settings | -0017:Sub Influence (%)=70 | -0018:Sub Scaling=56 | -0019:Sub Rotation=0 | -0020:Sub Offset=0,0 | -0021:Center Subscale=0 | -0022: | -0023:Evolution=0 | -0024:Evolution Options | -0025:Cycle Evolution=0 | -0026:Cycle (in Revolutions)=1 | -0027:Random Seed=0 | -0028:Random Seed | -0029:Opacity=100 | -0030:Blending Mode=2 | ADBE Effect Built In Params:Compositing Options

## ADBE Glo2 = Glow
-0001:Glow Based On=2 | -0002:Glow Threshold=153 | -0003:Glow Radius=10 | -0004:Glow Intensity=1 | -0005:Composite Original=2 | -0006:Glow Operation=3 | -0007:Glow Colors=1 | -0008:Color Looping=3 | -0009:Color Loops=1 | -0010:Color Phase=0 | -0011:A & B Midpoint=0.5 | -0012:Color A=1,1,1,1 | -0013:Color B=0,0,0,1 | -0014:Glow Dimensions=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Drop Shadow = Drop Shadow
-0001:Shadow Color=0,0,0,1 | -0002:Opacity=127.5 | -0003:Direction=135 | -0004:Distance=5 | -0005:Softness=0 | -0006:Shadow Only=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Gaussian Blur 2 = Gaussian Blur
-0001:Blurriness=25 | -0002:Blur Dimensions=1 | -0003:Repeat Edge Pixels=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Noise = Noise
-0001:Amount of Noise=0 | -0002:Noise Type=1 | -0003:Clipping=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Ramp = Gradient Ramp
-0001:Start of Ramp=50,0 | -0002:Start Color=0,0,0,1 | -0003:End of Ramp=50,100 | -0004:End Color=1,1,1,1 | -0005:Ramp Shape=1 | -0006:Ramp Scatter=0 | -0007:Blend With Original=0 | -0008: | ADBE Effect Built In Params:Compositing Options

## CS Vignette = CC Vignette
-0001:Amount=100 | -0002:Angle of View=45 | -0003:Center=50,50 | -0005:Pin Highlights=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Tint = Tint
-0001:Map Black To=0,0,0,0 | -0002:Map White To=1,1,1,0 | -0003:Amount to Tint=100 | -0004: | ADBE Effect Built In Params:Compositing Options

## ADBE Fill = Fill
-0001:Fill Mask=0 | -0007:All Masks=0 | -0002:Color=1,0,0,1 | -0006:Invert=0 | -0003:Horizontal Feather=0 | -0004:Vertical Feather=0 | -0005:Opacity=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Brightness & Contrast 2 = Brightness & Contrast
-0001:Brightness=0 | -0002:Contrast=0 | -0003:Use Legacy (supports HDR)=0 | ADBE Effect Built In Params:Compositing Options

## ADBE HUE SATURATION = Hue/Saturation
-0002:Channel Control=1 | -0003:Channel Range | -0004:Master Hue=0 | -0005:Master Saturation=0 | -0006:Master Lightness=0 | -0007:Colorize=0 | -0008:Colorize Hue=0 | -0009:Colorize Saturation=25 | -0010:Colorize Lightness=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Exposure2 = Exposure
-0001:Channels:=1 | -0002:Master | -0003:Exposure=0 | -0004:Offset=0 | -0005:Gamma Correction=1 | -0006:Master | -0007:Red | -0008:Red Exposure=0 | -0009:Red Offset=0 | -0010:Red Gamma Correction=1 | -0011:Red | -0012:Green | -0013:Green Exposure=0 | -0014:Green Offset=0 | -0015:Green Gamma Correction=1 | -0016:Green | -0017:Blue | -0018:Blue Exposure=0 | -0019:Blue Offset=0 | -0020:Blue Gamma Correction=1 | -0021:Blue | -0022:Bypass Linear Light Conversion=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Easy Levels2 = Levels
-0001:Channel:=1 | -0002:Histogram | -0003:Input Black=0 | -0004:Input White=1 | -0005:Gamma=1 | -0006:Output Black=0 | -0007:Output White=1 | -0008:Clip To Output Black=3 | -0009:Clip To Output White=3 | ADBE Effect Built In Params:Compositing Options

## ADBE Camera Lens Blur = Camera Lens Blur
-0001:Blur Radius=5 | -0002:Iris Properties | -0003:Shape=4 | -0004:Roundness=0 | -0005:Aspect Ratio=1 | -0006:Rotation=0 | -0007:Diffraction Fringe=100 | -0008:Iris Properties | -0009:Blur Map | -0010:Layer=0 | -0011:Channel=1 | -0012:Placement=1 | -0013:Blur Focal Distance=0 | -0014:Invert Blur Map=0 | -0015:Blur Map | -0016:Highlight | -0017:Gain=0 | -0018:Threshold=0.80000001192093 | -0019:Saturation=0 | -0020:Highlight | -0021:Edge Behavior=1 | -0022:Use Linear Working Space=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Set Matte3 = Set Matte
-0001:Take Matte From Layer=1 | -0002:Use For Matte=4 | -0003:Invert Matte=0 | -0004:If Layer Sizes Differ=1 | -0005:Composite Matte with Original=1 | -0006:Premultiply Matte Layer=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Turbulent Displace = Turbulent Displace
-0001:Displacement=1 | -0002:Amount=50 | -0003:Size=100 | -0004:Offset (Turbulence)=50,50 | -0005:Complexity=1 | -0006:Evolution=0 | -0007:Evolution Options | -0008:Cycle Evolution=0 | -0009:Cycle (in Revolutions)=1 | -0010:Random Seed=0 | -0011:Random Seed | -0012:Pinning=3 | -0013:Resize Layer=0 | -0014:Antialiasing for Best Quality=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Venetian Blinds = Venetian Blinds
-0001:Transition Completion=0 | -0002:Direction=0 | -0003:Width=20 | -0004:Feather=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Linear Wipe = Linear Wipe
-0001:Transition Completion=0 | -0002:Wipe Angle=90 | -0003:Feather=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Radial Wipe = Radial Wipe
-0001:Transition Completion=0 | -0002:Start Angle=0 | -0003:Wipe Center=50,50 | -0004:Wipe=1 | -0005:Feather=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Motion Blur = Directional Blur
-0001:Direction=90 | -0002:Blur Length=10 | ADBE Effect Built In Params:Compositing Options

## ADBE Directional Blur -> NO DISPONIBLE (Error: After Effects error: Can not add a property with name “ADBE Directional Blur” to this PropertyGroup.)

## ADBE Radial Blur = Radial Blur
-0005: | -0001:Amount=10 | -0002:Center=50,50 | -0003:Type=1 | -0004:Antialiasing (Best Quality)=1 | -0006:Random Seed=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Posterize Time = Posterize Time
-0001:Frame Rate=24 | ADBE Effect Built In Params:Compositing Options

## ADBE Stroke = Stroke
-0001:Path=0 | -0010:All Masks=0 | -0011:Stroke Sequentially=1 | -0002:Color=1,1,1,1 | -0003:Brush Size=2 | -0004:Brush Hardness=0.75 | -0005:Opacity=1 | -0008:Start=0 | -0009:End=100 | -0006:Spacing=15 | -0007:Paint Style=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Grid = Grid
-0001:Anchor=50,50 | -0002:Size From=1 | -0003:Corner=60,60 | -0004:Width=32 | -0005:Height=24 | -0006:Border=5 | -0007:Feather | -0008:Width=0 | -0009:Height=0 | -0010:Height | -0011:Invert Grid=0 | -0012:Color=1,1,1,1 | -0013:Opacity=100 | -0014:Blending Mode=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Circle = Circle
-0001:Center=50,50 | -0002:Radius=75 | -0003:Edge=1 | -0004:Contextual Slider=10 | -0005:Feather | -0006:Feather Outer Edge=0 | -0007:Feather Inner Edge=0 | -0008:Feather Inner Edge | -0009:Invert Circle=0 | -0010:Color=1,1,1,1 | -0011:Opacity=100 | -0012:Blending Mode=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Tile = Motion Tile
-0001:Tile Center=50,50 | -0002:Tile Width=100 | -0003:Tile Height=100 | -0004:Output Width=100 | -0005:Output Height=100 | -0006:Mirror Edges=0 | -0007:Phase=0 | -0008:Horizontal Phase Shift=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Offset = Offset
-0001:Shift Center To=50,50 | -0002:Blend With Original=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Transform -> NO DISPONIBLE (Error: After Effects error: Can not add a property with name “ADBE Transform” to this PropertyGroup.)

## ADBE Geometry2 = Transform
-0001:Anchor Point=50,50 | -0002:Position=50,50 | -0011:Uniform Scale=1 | -0003:Scale Height=100 | -0004:Scale Width=100 | -0005:Skew=0 | -0006:Skew Axis=0 | -0007:Rotation=0 | -0008:Opacity=100 | -0009:Use Composition’s Shutter Angle=1 | -0010:Shutter Angle=0 | -0012:Sampling=1 | ADBE Effect Built In Params:Compositing Options

## PEDG2 = Deep Glow 2
-0001:About & Support | -0002:Deep Glow 2 v1.1.0 | -0003:AE 13.29 | -0004:OS (sistema) | -0005:(GPU) | -0157:(driver) | -0158: | -0141:Error Logging | -0138: | -0140: | -0139: | -0159:Debug Analysis Enable=0 | -0142: | -0010: | -0011: | -0012: | -0013:Unlicensed, click 'Register' | -0014: | -0015:to enter your serial key. | -0016: | -0128:Main | -0103:Glow Mode=1 | -0024:Blend Mode=1 | -0017:Radius=1000 | -0018:Exposure=1 | -0129: | -0130: | -0019:Input | -0095:Threshold Mode=1 | -0020:Threshold=0 | -0021:Threshold Smooth=0 | -0096:Saturation Bias=0 | -0149:Input Masking | -0074:Warning: enable cont. raster | -0075: | -0076:for correct mask behavior | -0077: | -0150:Mask Layer=0 | -0151:Mask Mode=1 | -0152:Mask Invert=0 | -0153: | -0121: | -0022: | -0104:Iris | -0105:Iris Layer=1 | -0110:Warning Iris Layer not supplied | -0111: | -0112:Output will be blank | -0113: | -0107:Iris Sampling Quality=3 | -0118:Iris Iterations=10 | -0119:Radii Easing=90 | -0122: | -0106: | -0023:Style | -0025:Gamma Correction | -0116:Scene Gamma:  | -0117: | -0026:Auto Detect Gamma=1 | -0154:Gamma Correction=100 | -0028: | -0156: | -0029: | -0030:Aspect Ratio | -0031:Aspect Ratio=1 | -0032:Enable Angle=0 | -0033:Aspect Angle=0 | -0123: | -0034: | -0035:Chromatic Aberration | -0036:Enable Pixel Aberration=0 | -0037:Aberration Channels=2 | -0038:Pixel Offset=1 | -1036:Enable Glow Aberration=0 | -0097:Multiply Red=80 | -0098:Multiply Green=100 | -0099:Multiply Blue=120 | -0100: | -0101: | -0039: | -0040:Tint | -0043:Tint Mode=1 | -0067:Tint Blend Mode=1 | -0042:Color=1,0,0,1 | -0066:Color Outer=1,0.50196078431373,0,1 | -0069: | -0044:Tint Strength=100 | -0124: | -0045: | -0081:Tone Mapping | -0093:Operation=1 | -0082:Mix=100 | -0125: | -0083: | -0085:Lens Dirt Texture | -0086:Texture=0 | -0088:Opacity=100 | -0148:Inherit Glow Color=0 | -0089:Matte Exposure=0 | -0090:Matte Gamma=1 | -0120:Repeat Edges=1 | -0126: | -0092: | -0046: | -0047:Quality | -0048:Quality Preset=3 | -1048:Quality Preset Iris=3 | -0094:Half Float=1 | -0049:Resolution=75 | -0050:Steps Multiplier=0.5 | -0051:Glow Iterations=8 | -0064:Buffer Expansion Mode=1 | -0065:Aux Buffer Expansion=0 | -0127: | -0052: | -0053:View=1 | -0135:View=1 | -0054:Source Opacity=100 | -0055:Unmult=1 | -0056:Debug | -0155:Pre Proc Solid Fill=0 | -0131:Iris Sample Quality=50 | -0136:Debug View=3 | -0132:Draw Dimensions Comp UI=0 | -0057:Show Buffers=0 | -0114:cout PreRender Rects=0 | -0115:cout Buffer Dims=0 | -0137:Shaders Per Frame=0 | -0058:Edge Behaviour (Deprecated)=2 | -0102:Renderer (Deprecated)=1 | -0109:Metal GPU Capture=0 | -0143:Simplified Exposure=1 | -0146:Iris Cull Small Values=1 | -0059:Left=0 | -0060:Top=0 | -0061:Right=0 | -0062:Bottom=0 | -0063: | -0133:Deprecated | -0027:Gamma Correction=0 | -0078:Astigmatism | -0070:Enable Astigmatism=0 | -0079:Force Square Ratio=0 | -0071:View Focal Point=0 | -0072:Focal Length=50 | -0073:Focal Falloff=50 | -0080: | -0091:Lens View=1 | -0108:View Iris=0 | -0041:Enable=0 | -0087:Blend Mode=1 | -0084:Enable=0 | -0068:Inner/Outer Bias=50 | -0006:Deprecated=1 | -0007:Deprecated=1 | -0008:Deprecated=1 | -0009:Deprecated=1 | -1107:Render Quality (Quantization)=6 | -0134: | ADBE Effect Built In Params:Compositing Options

## CS Particle World -> NO DISPONIBLE (Error: After Effects error: Can not add a property with name “CS Particle World” to this PropertyGroup.)

## ADBE Color Balance (HLS) = Color Balance (HLS)
-0001:Hue=0 | -0002:Lightness=0 | -0003:Saturation=0 | ADBE Effect Built In Params:Compositing Options

## ADBE CurvesCustom = Curves
-0002:Channel:=1 | -0001:Curves | ADBE Effect Built In Params:Compositing Options

## ADBE Lumetri = Lumetri Color
-0001:Blob | -0062:High Dynamic Range=0 | -0002:Basic Correction | -0003:Active=1 | -0004:  | -0095:  | -0005:Input LUT=1 | -0127:Input LUT=1 | -0063:HDR White=100 | -0120:  | -0119:  | -0123:Intensity=50 | -0006:Color | -0094:White Balance=0.75294117647059,0.75294117647059,0.75294117647059,1 | -0007:Temperature=0 | -0008:Tint=0 | -0020:Saturation=100 | -0009: | -0010:Light | -0011:Exposure=0 | -0012:Contrast=0 | -0013:Highlights=0 | -0014:Shadows=0 | -0015:Whites=0 | -0016:Blacks=0 | -0064:HDR Specular=0 | -0017:  | -0018:  | -0019: | -0021: | -0022:Creative | -0023:Active=1 | -0024:  | -0096:  | -0025:Look=1 | -0128:Look=1 | -0129:  | -0130:Color Space=29 | -0026:Intensity=100 | -0027:Adjustments | -0028:Faded Film=0 | -0029:Sharpen=0 | -0030:Vibrance=0 | -0031:Saturation=100 | -0032:Split Toning | -0033:Tint Balance=0 | -0034: | -0035: | -0036:Curves | -0037:Active=1 | -0038:RGB Curves | -0118:Active=1 | -0065:HDR Range=100 | -0039:RGB Curve | -0040: | -0041:Hue Saturation Curves | -0104:Active=1 | -0113:Hue (vs Sat) Selector=0,0,0.00392156862745,1 | -0042:Hue vs Sat | -0105:Active=1 | -0114:Hue (vs Hue) Selector=0,0,0.00392156862745,1 | -0106:Hue vs Hue | -0107:Active=1 | -0115:Hue (vs Luma) Selector=0,0,0.00392156862745,1 | -0108:Hue vs Luma | -0109:Active=1 | -0116:Luma (vs Sat) Selector=0,0,0.00392156862745,1 | -0110:Luma vs Sat | -0111:Active=1 | -0117:Sat (vs Sat) Selector=0,0,0.00392156862745,1 | -0112:Sat vs Sat | -0043: | -0044: | -0045:Color Wheels | -0046:Active=1 | -0101:  | -0102:Face Detection=1 | -0103:  | -0066:HDR White=100 | -0047:Wheels | -0048: | -0067:HSL Secondary | -0068:Active=1 | -0069:Key | -0070:Set color=0,0,0,1 | -0071:Add color=0,0,0,1 | -0072:Remove color=0,0,0,1 | -0073:HSL Sliders | -0074:Show Mask=0 | -0075: =1 | -0076:Invert Mask=0 | -0077:  | -0078:  | -0079:  | -0080:Refine | -0081:Denoise=0 | -0082:Blur=0 | -0083:Blur | -0084:Correction | -0085:Color Wheels | -0093:  | -0086:Temperature=0 | -0087:Tint=0 | -0088:Contrast=0 | -0089:Sharpen=0 | -0090:Saturation=100 | -0091:Saturation | -0092: | -0049:Vignette | -0050:Active=1 | -0051:Amount=0 | -0052:Midpoint=50 | -0053:Roundness=0 | -0054:Feather=50 | -0055: | -0056:SpeedGrade Custom | -0057:Custom Layer=1 | -0058:unused | -0059:unused | -0060:  | -0061: | -0097:Legacy Tone And Saturation=0 | -0098:Embedded LUTs | -0099:Media Embedded LUT type | -0100:Media Embedded Lut blob | -0121:SemanticAutoTone Progress=-1 | -0122:Auto Tone Analytics Data | -0124:Auto Color Active...=0 | -0125:LUTAsset | -0126:LookAsset | ADBE Effect Built In Params:Compositing Options

## ADBE Photo Filter PS -> NO DISPONIBLE (Error: After Effects error: Can not add a property with name “ADBE Photo Filter PS” to this PropertyGroup.)

## ADBE Pro Levels2 = Levels (Individual Controls)
-0001:Channel:=1 | -0002:Histogram | -0003:RGB | -0004:Input Black=0 | -0005:Input White=1 | -0006:Gamma=1 | -0007:Output Black=0 | -0008:Output White=1 | -0009:RGB | -0010:Red | -0011:Red Input Black=0 | -0012:Red Input White=1 | -0013:Red Gamma=1 | -0014:Red Output Black=0 | -0015:Red Output White=1 | -0016:Red | -0017:Green | -0018:Green Input Black=0 | -0019:Green Input White=1 | -0020:Green Gamma=1 | -0021:Green Output Black=0 | -0022:Green Output White=1 | -0023:Green | -0024:Blue | -0025:Blue Input Black=0 | -0026:Blue Input White=1 | -0027:Blue Gamma=1 | -0028:Blue Output Black=0 | -0029:Blue Output White=1 | -0030:Blue | -0031:Alpha | -0032:Alpha Input Black=0 | -0033:Alpha Input White=1 | -0034:Alpha Gamma=1 | -0035:Alpha Output Black=0 | -0036:Alpha Output White=1 | -0037:Alpha | -0038:Clip To Output Black=3 | -0039:Clip To Output White=3 | ADBE Effect Built In Params:Compositing Options

## ADBE Simple Choker = Simple Choker
-0001:View=1 | -0002:Choke Matte=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Minimax = Minimax
-0001:Operation=2 | -0002:Radius=0 | -0003:Channel=1 | -0004:Direction=1 | -0005:Don't Shrink Edges=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Echo = Echo
-0001:Echo Time (seconds)=-0.0333333350718 | -0002:Number Of Echoes=1 | -0003:Starting Intensity=1 | -0004:Decay=1 | -0005:Echo Operator=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Displacement Map = Displacement Map
-0001:Displacement Map Layer=1 | -0002:Use For Horizontal Displacement=1 | -0003:Max Horizontal Displacement=5 | -0004:Use For Vertical Displacement=2 | -0005:Max Vertical Displacement=5 | -0006:Displacement Map Behavior=1 | -0007:Edge Behavior=0 | -0008:Expand Output=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Bulge = Bulge
-0001:Horizontal Radius=50 | -0002:Vertical Radius=50 | -0003:Bulge Center=50,50 | -0004:Bulge Height=1 | -0005:Taper Radius=0 | -0006:Antialiasing (Best Qual Only)=1 | -0007:Pinning=0 | ADBE Effect Built In Params:Compositing Options

## ADBE Spherize = Spherize
-0001:Radius=0 | -0002:Center of Sphere=50,50 | ADBE Effect Built In Params:Compositing Options

## ADBE Wave Warp = Wave Warp
-0001:Wave Type=1 | -0002:Wave Height=10 | -0003:Wave Width=40 | -0004:Direction=90 | -0005:Wave Speed=1 | -0006:Pinning=1 | -0007:Phase=0 | -0008:Antialiasing (Best Quality)=1 | ADBE Effect Built In Params:Compositing Options

## ADBE Glitter -> NO DISPONIBLE (Error: After Effects error: Can not add a property with name “ADBE Glitter” to this PropertyGroup.)

## ADBE Roughen Edges = Roughen Edges
-0001:Edge Type | -0010:Edge Color | -0002:Border | -0003:Edge Sharpness | -0004:Fractal Influence | -0005:Scale (mín. 10) | -0006:Stretch Width or Height | -0007:Offset (Turbulence) | -0008:Complexity | -0009:Evolution | -0011:Evolution Options | -0012:Cycle Evolution | -0013:Cycle (in Revolutions) | -0014/-0015:Random Seed

## ADBE Tint = Tint
-0001:Map Black To | -0002:Map White To | -0003:Amount to Tint (%)

## ADBE Motion Blur = Directional Blur
-0001:Direction (0 = vertical) | -0002:Blur Length

## Cámara (ADBE Camera Options Group)
ADBE Camera Zoom | ADBE Camera Depth of Field | ADBE Camera Focus Distance | ADBE Camera Aperture | ADBE Camera Blur Level (oculto en AE 2026) | ADBE Camera Focus Area Width | ADBE Camera Split Blur Level | ADBE Iris Shape/Rotation/Roundness/Aspect Ratio/Diffraction Fringe/Highlight Gain/Threshold/Saturation

## Texto: selector de expresión
Animador: ADBE Text Animator → ADBE Text Selectors → addProperty("ADBE Text Expressible Selector") → propiedad "ADBE Text Expressible Amount" (expresión por carácter con textIndex). Propiedades de animador: ADBE Text Position 3D, ADBE Text Rotation, ADBE Text Opacity, ADBE Text Scale 3D, ADBE Fill Color.

## Añadidos en la Tanda 03 · 05 "EDITS" (01/10/2026)

## Keylight 906 = Keylight (1.2)
-0002:View (5 Screen Matte, 11 Final Result) | -0004:Screen Colour | -0005:Screen Gain | -0006:Screen Balance | -0007:Despill Bias | -0008:Alpha Bias | -0010:Screen Pre-blur | -0012:Clip Black | -0013:Clip White | -0014:Clip Rollback | -0015:Screen Shrink/Grow | -0016:Screen Softness | -0017/-0018:Despot Black/White | -0036:Enable Colour Correction

## ADBE Matte Choker = Matte Choker
1:Geometric Softness 1 | 2:Choke 1 (−100 ensancha) | 3:Gray Level Softness 1 (0–1) | 4:Geometric Softness 2 | 5:Choke 2 | 6:Gray Level Softness 2 (0–1) | 7:Iterations

## ADBE Simple Choker = Simple Choker
-0001:View | -0002:Choke Matte

## ADBE Spill2 = Advanced Spill Suppressor
-0001:Method | -1001:Suppression | -0003:Key Color | -0004:Tolerance | -0005:Desaturate | -0006:Spill Range | -0007:Spill Color Correction | -0008:Luma Correction

## ADBE Easy Levels2 = Levels
-0001:Channel | -0003:Input Black | -0004:Input White | -0005:Gamma | -0006:Output Black | -0007:Output White (por script, -0004 y -0005 NO admiten keys: animar la opacidad del efecto)

## ADBE Photo Filter = Photo Filter
-0001:Filter | -0002:Color | -0003:Density (%) | -0004:Preserve Luminosity

## ADBE Vibrance = Vibrance
1:Vibrance | 2:Saturation

## ADBE Offset = Offset (Desplazamiento)
-0001:Shift Center To | -0002:Blend With Original

## ADBE Tile = Motion Tile (Mosaico con movimiento)
-0001:Tile Center | -0002:Tile Width | -0003:Tile Height | -0004:Output Width | -0005:Output Height | -0006:Mirror Edges | -0007:Phase | -0008:Horizontal Phase Shift

## ADBE Echo = Echo
-0001:Echo Time (s) | -0002:Number Of Echoes | -0003:Starting Intensity | -0004:Decay | -0005:Echo Operator (1 Add, 2 Max, 3 Min, 4 Screen, 5 Composite In Back, 6 Composite In Front, 7 Blend)

## ADBE Fill = Fill (Relleno)
-0001:Fill Mask | -0007:All Masks | -0002:Color | -0006:Invert | -0003/-0004:Horizontal/Vertical Feather | -0005:Opacity

## S_BlurMoCurves (Sapphire) = el zoom con distancia Z ("Blur More Curves")
-0050:Center XY | -0051:Z Dist (1 normal, < 1 acerca) | -0052:Rotate | -0053/-0054:Shift X/Y | -0055:Shutter Duration | -0056:Shutter Shift | -0059/-0060:Wrap X/Y

## S_Shake (Sapphire)
-0050:Amplitude (multiplicador) | -0051:Frequency | -0110:Stillness | -0053:Z Dist | -0054:Motion Blur | -0055:Mo Blur Length | -0057/-0058:Wrap X/Y | -0059:X Rand Amp (192) | -0064:Y Rand Amp (96) | -0074:Tilt Rand Amp

## S_TVDamage (Sapphire)
-0050:Reception Master | -0051:Interference Amp | -0052:Ghost Amp | -0053:Horizontal Hold | -0054:Vertical Hold (0 = no rueda) | -0055:Bars Brightness | -0056:Color Stripes | -0060:Static Amplitude | -0061:Static Density | -0101:Scanlines | -0112:Turn Off

## S_Flicker (Sapphire)
-0050:Amplitude | -0051:Rand Luma Amp | -0052:Rand Color Amp | -0053:Rand Freq | -0054:Wave Amp | -0055:Wave Freq

## S_Vignette (Sapphire)
-0050:Center XY | -0052:Radius | -0053:Rel Height | -0056:Edge Softness | -0058:Color | -0059:Opacity

## S_Rays (Sapphire) = rayos tipo Shine
-0050:Center XY | -0051:Rays Length | -0052:Rays Brightness | -0053:Rays Color | -0056:Threshold | -0065:Affect Alpha | -0066:Rays From Alpha | -0068:Source Opacity

## S_BlurChroma (Sapphire)
-0050:Blur Chroma | -0051:Blur Luminance | -0100:Mix With Source

## PEDG2 (Deep Glow 2) — extra
-0017:Radius | -0018:Exposure | -0020:Threshold | -0043:Tint Mode | -0082:Mix (animable: pulsos 0 → 30 → 0)

## Capa de texto 3D (motor Cinema 4D, comp.renderer = "ADBE Ernst")
ADBE Extrsn Options Group → ADBE Extrsn Depth | ADBE Bevel Styles | ADBE Bevel Direction | ADBE Bevel Depth | ADBE Hole Bevel Depth
ADBE Material Options Group → ADBE Specular Coefficient | ADBE Shininess Coefficient | ADBE Metal Coefficient | ADBE Reflection Coefficient | ADBE Glossiness Coefficient | ADBE Fresnel Coefficient | ADBE Transparency Coefficient | ADBE Index of Refraction
Luz de entorno (LightType.ENVIRONMENT): ADBE Light Env Atom (fuente) | ADBE Light Backgd Visible | ADBE Light Backgd Opacity | ADBE Light Backgd Blur

## Novedades de AE 2026 (26.5), probadas en la Tanda 05 · 01 (02/10/2026)
Se encontraron con `scripts/buscar_matchnames.py` (busca los nombres dentro de los .dll de AE, solo leyendo) y con sondeos en AE.

### Mallas paramétricas: `comp.layers.addParametricMesh(nombre, ParametricMeshType.X)`
- Tipos (enum `ParametricMeshType`): CUBE 14612 · SPHERE 14613 · PLANE 14614 · TORUS 14615 · CONE 14616 · CYLINDER 14617. Capa: matchName `ADBE3D ParametricMeshLayer`, 3D desde el principio.
- Comandos de menú (la herramienta de la barra): Cube 10730 · Sphere 10731 · Plane 10732 · Torus 10733 · Cone 10734 · Cylinder 10735.
- La capa trae los grupos de TODOS los tipos; solo se puede tocar el suyo (los demás están ocultos):
  - ADBE SphereMeshOptionsSGrp → ADBE SphereRadiusStrm (100) | ADBE SphereSidesStrm (48) | ADBE SphereSliceCapsStrm | ADBE SphereStartAngleStrm (0) | ADBE SphereEndAngleStrm (360) | ADBE SphereInvertSliceStrm | ADBE SphereSmoothingAngleStrm (40)
  - ADBE CubeMeshOptionsSGrp → ADBE CubeWidthStrm | ADBE CubeHeightStrm | ADBE CubeDepthStrm (200) | ADBE CubeSmoothingAngleStrm · ADBE CubeBevelOptionsSGrp → ADBE CubeBevelRadiusStrm (0) | ADBE CubeBevelSidesStrm (20)
  - ADBE PlaneMeshOptionsSGrp → ADBE PlaneWidthStrm | ADBE PlaneLengthStrm (200) | ADBE PlaneCornerRadiusStrm | ADBE PlaneCornerSidesStrm · ADBE Plane Options Group → ADBE Plane Curvature | ADBE Plane Subdivision
  - ADBE TorusMeshOptionsSGrp → ADBE TorusRingRadiusStrm (100) | ADBE TorusPipeRadiusStrm (20) | ADBE TorusRingSidesStrm | ADBE TorusPipeSidesStrm (48) | ADBE TorusCapsStrm | ADBE TorusStartAngleStrm | ADBE TorusEndAngleStrm | ADBE TorusInvertSliceStrm | ADBE TorusSmoothingAngleStrm
  - ADBE ConeMeshOptionsSGrp → ADBE ConeTopRadiusStrm (0) | ADBE ConeBottomRadiusStrm (100) | ADBE ConeHeightStrm (200) | ADBE ConeSidesStrm | ADBE ConeTopCapStrm | ADBE ConeBottomCapStrm | ADBE ConeSliceCapsStrm | ADBE ConeStartAngleStrm | ADBE ConeEndAngleStrm | ADBE ConeInvertSliceStrm | ADBE ConeSmoothingAngleStrm · ADBE ConeBevelBevelSGrp → ADBE ConeBevelTopRadiusStrm | ADBE ConeBevelTopSidesStrm | ADBE ConeBevelBottomRadiusStrm | ADBE ConeBevelBottomSidesStrm
  - ADBE CylinderMeshOptionsSGrp → ADBE CylinderRadiusStrm (100) | ADBE CylinderHeightStrm (200) | ADBE CylinderSidesStrm | ADBE CylinderTopCapStrm | ADBE CylinderBottomCapStrm | ADBE CylinderSliceCapsStrm | ADBE CylinderStartAngleStrm | ADBE CylinderEndAngleStrm | ADBE CylinderInvertSliceStrm | ADBE CylinderSmoothingAngleStrm · ADBE CylinderBevelOptionsSGrp → ADBE CylinderBevelRadiusStrm (= radio → píldora) | ADBE CylinderBevelSidesStrm
- Material: ADBE3D Para Mat Parade → ADBE3D Param Mat Atom → ADBE3D Material Projection | ADBE3D Material Texturre Offset (sic) | ADBE3D Material Rotation | ADBE3D Material Scale | **ADBE3D Base Color** | **ADBE3D Roughness** (30) | **ADBE3D Metallic** (30) | ADBE3D Emission | ADBE3D Emission Intensity | ADBE3D Ambient
- Desplazamiento (para materiales Substance): ADBE Displacement Options → ADBE Displacement Intensity | ADBE Subdivision Count
- Sombras con el motor Advanced 3D: ADBE Compositing Options Group → ADBE Casts Shadows | ADBE Accepts Shadows | ADBE Accepts Lights | ADBE Shadow Color

### Fuentes variables
- `Font`: hasDesignAxes | designAxesData ([{name, tag, min, max, default}]) | designVector | **postScriptNameForDesignVector([wght, wdth…])** → p. ej. "Bahnschrift_650.000wght_80.000wdth" (se puede poner en `doc.font`).
- Animador: `animador.property("ADBE Text Animator Properties").addVariableFontAxis("wght")` → **ADBE Text VF Axis 1** («Font Axis Weight», valor ABSOLUTO del eje: 400 de inicio). Hay hasta ADBE Text VF Axis 8. `canAddProperty` dice false y `addProperty` falla: solo vale `addVariableFontAxis(tag)` (llamado en la capa da un error interno).
- Fuentes variables en el PC del autor (comprobado con `hasDesignAxes`): **Bahnschrift** (wght 300–700, wdth 75–100), **Segoe UI Variable** (wght 300–700, opsz 5–36), Cascadia Code y Cascadia Mono (wght 200–700), Sitka (opsz 6–27,5, wght 400–700) y Arsenica Variable (wght 100–800, opsz 100–1000).

### Otros
- **Unmult** (quita el negro de fuego, chispas, destellos) = `ADBE Unmult` [Keying].
- Audio nuevos: Gate = `ADBE Aud Gate`, Compressor = `ADBE Aud Compressor`, Distortion = `ADBE Aud Distortion`.
- Relleno de degradado de forma (ADBE Vector Graphic - G-Fill): nuevos **ADBE Vector Grad Scale** y **ADBE Vector Grad Rotation** (los colores siguen sin poderse poner por script).
- Luces (ADBE Light Options Group): ADBE Light Intensity | ADBE Light Color | ADBE Light Cone Angle | ADBE Light Cone Feather 2 | ADBE Light Falloff Type | ADBE Light Falloff Start | ADBE Light Falloff Distance | ADBE Casts Shadows | ADBE Light Shadow Darkness | ADBE Light Shadow Diffusion (oculta en la luz paralela).
- Máscaras de efecto (Opciones de composición de cada efecto): ADBE Effect Built In Params → ADBE Effect Mask Parade → `addProperty("ADBE Effect Mask")` → ADBE Effect Path Stream Ref (tipo MASK_INDEX; 0 = ninguna) | ADBE Effect Mask Opacity | ADBE Force CPU GPU. ⚠️ Puesta por script (valor 1) el efecto siguió en toda la capa (comprobado con render): hacerlo a mano o con una copia + máscara.
- Comandos: Center Anchor Point in Layer Content 10312 · Track Mask 10311 · Variable Font Axes 10746 (por script no añadió nada).