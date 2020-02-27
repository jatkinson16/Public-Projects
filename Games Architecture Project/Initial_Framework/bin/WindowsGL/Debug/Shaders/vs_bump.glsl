#version 330

layout (location = 0) in vec3 a_Position;
layout (location = 1) in vec2 a_TexCoord;
layout (location = 2) in vec3 a_Normal;
layout (location = 3) in vec3 a_Tangent;
layout (location = 4) in vec3 a_Binormal;

uniform mat4 ModelViewProjMat;
uniform mat4 ModelMat;
uniform mat4 ModelView;


out vec2 v_TexCoord;
out vec3 v_Normal;
out vec3 v_FragPos;
out vec3 v_View;
out vec3 v_LightDir;

void main()
{
	
	
	

	float normalChange = 1.0;
	gl_Position = ModelViewProjMat * vec4(a_Position, 1.0);

	//vec3 lightPos = vec3(-28.5,10,28.5) * vec3(ModelMat);
	vec3 lightPos = vec3(28.5, 5, 28.5);
	lightPos = (ModelMat * vec4(lightPos, 1.0)).xyz;

	mat4 normalMatrix = transpose(inverse(ModelMat));
	mat3 norm = mat3(normalMatrix); //gl_NormalMatrix


	vec3 newNormal = normalize(a_Normal * norm) ;

	vec3 vBinormal = normalize(a_Binormal * norm);
	vec3 vTangent = normalize(a_Tangent * norm);

	vec4 objectPos = ModelMat * vec4(a_Position, 1.0); //this is correct I think (gl_Vertex replacement)

	mat3 View2Tangent = mat3(vTangent, vBinormal, newNormal + normalChange);

	vec3 view = vec3(a_Position - objectPos.xyz); //not causing the issue
	view *= View2Tangent;
	v_View = view;

	

	vec3 lightDir = normalize(lightPos  - objectPos.xyz);
	//vec3 lightDir = normalize(lightPos  - vec3(gl_Position));

	//lightDir *= View2Tangent;
	v_LightDir = normalize(lightDir);

	v_FragPos = vec3(ModelView * vec4(a_Position, 1.0));
	//v_FragPos = a_Position;
	v_TexCoord = a_TexCoord;
	v_Normal = newNormal;

	
}